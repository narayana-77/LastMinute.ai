import React, {
  useState,
  useEffect,
  useRef
} from 'react';

import {
  Link,
  Outlet,
  useNavigate,
  useLocation
} from 'react-router-dom';
import {
  BrainCircuit,
  LayoutDashboard,
  FileText,
  Video,
  Code2,
  Users,
  Target,
  Zap,
  BarChart3,
  History,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  Clock,
  TrendingUp,
  MessageSquare,
  Star,
  Sparkles
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import ErrorBoundary from '../components/ErrorBoundary';

import ToastContainer from '../components/Toast';
import AIAssistant from '../components/AIAssistant';
import ProfileDropdown from '../components/ProfileDropdown';

import './DashboardLayout.css';

const ROUTE_META = {
  '/dashboard': {
    label: 'Dashboard',
    crumb: ['Home', 'Dashboard']
  },

  '/dashboard/resume': {
    label: 'Resume Analyzer',
    crumb: ['Home', 'Resume Analyzer']
  },

  '/dashboard/mock': {
    label: 'Mock Interviews',
    crumb: ['Home', 'Mock Interviews']
  },

  '/dashboard/coding': {
    label: 'Coding Interview',
    crumb: ['Home', 'Coding Interview']
  },

  '/dashboard/hr': {
    label: 'HR Trainer',
    crumb: ['Home', 'HR Trainer']
  },

  '/dashboard/panic': {
    label: 'Panic Mode 🔥',
    crumb: ['Home', 'Panic Mode']
  },

  '/dashboard/analytics': {
    label: 'Analytics',
    crumb: ['Home', 'Analytics']
  },

  '/dashboard/history': {
    label: 'History',
    crumb: ['Home', 'History']
  },

  '/dashboard/settings': {
    label: 'Settings',
    crumb: ['Home', 'Settings']
  },

  '/dashboard/notifications': {
    label: 'Notifications',
    crumb: ['Home', 'Notifications']
  },

  '/dashboard/profile': {
    label: 'My Profile',
    crumb: ['Home', 'Profile']
  }
};

const SEARCH_MODULES = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview of your interview prep'
  },

  {
    label: 'Resume Analyzer',
    path: '/dashboard/resume',
    icon: FileText,
    description: 'Upload and analyze your resume'
  },

  {
    label: 'Mock Interviews',
    path: '/dashboard/mock',
    icon: Video,
    description: 'Practice mock interview rounds'
  },

  {
    label: 'Coding Interview',
    path: '/dashboard/coding',
    icon: Code2,
    description: 'Solve coding challenges'
  },

  {
    label: 'HR Trainer',
    path: '/dashboard/hr',
    icon: Users,
    description: 'Prepare for HR rounds'
  },

  {
    label: 'Domain Prep',
    path: '/dashboard/domain',
    icon: Target,
    description: 'Domain-specific preparation'
  },

  {
    label: 'Panic Mode',
    path: '/dashboard/panic',
    icon: Zap,
    description: 'Last minute interview prep'
  },

  {
    label: 'Analytics',
    path: '/dashboard/analytics',
    icon: BarChart3,
    description: 'View your performance analytics'
  },

  {
    label: 'History',
    path: '/dashboard/history',
    icon: History,
    description: 'Your interview history'
  },

  {
    label: 'Settings',
    path: '/dashboard/settings',
    icon: Settings,
    description: 'Manage your account settings'
  },

  {
    label: 'Notifications',
    path: '/dashboard/notifications',
    icon: Bell,
    description: 'View your alerts and updates'
  }
];

const SidebarItem = ({
  icon: Icon,
  label,
  path = '#',
  active,
  badge,
  onClick,
  className = ''
}) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Link
      to={path}
      onClick={handleClick}
      className={`sidebar-item ${active ? 'active' : ''} ${className}`}
    >
      <Icon size={20} className="sidebar-icon" />

      <span className="sidebar-label">
        {label}
      </span>

      {badge && (
        <span className="sidebar-badge">
          {badge}
        </span>
      )}

      {active && (
        <ChevronRight size={14} className="sidebar-active-chevron" />
      )}
    </Link>
  );
};

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const navigate = useNavigate();

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const q = query.toLowerCase();

    const filtered = SEARCH_MODULES.filter(
      m =>
        m.label.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
    );

    setSuggestions(filtered);
    setShowDropdown(filtered.length > 0);
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClick
      );
  }, []);

  const handleSelect = (path) => {
    setQuery('');
    setShowDropdown(false);
    navigate(path);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      setActiveIndex(prev =>
        Math.min(prev + 1, suggestions.length - 1)
      );
    }

    else if (e.key === 'ArrowUp') {
      setActiveIndex(prev =>
        Math.max(prev - 1, 0)
      );
    }

    else if (
      e.key === 'Enter' &&
      activeIndex >= 0
    ) {
      handleSelect(suggestions[activeIndex].path);
    }

    else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div className="search-wrapper">
      <div className="search-bar">
        <Search
          size={18}
          className="search-icon"
        />

        <input
          ref={inputRef}
          type="text"
          placeholder="Search modules, features..."
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          onKeyDown={handleKeyDown}
          onFocus={() =>
            query &&
            setShowDropdown(
              suggestions.length > 0
            )
          }
          autoComplete="off"
        />

        {!query && (
          <div className="search-shortcut-badge">
            <span className="shortcut-symbol">⌘</span> K
          </div>
        )}

        {query && (
          <button
            className="search-clear-btn"
            onClick={() => {
              setQuery('');
              setShowDropdown(false);
            }}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          className="search-dropdown"
          ref={dropdownRef}
        >
          {suggestions.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={item.path}
                className={`search-suggestion ${
                  idx === activeIndex
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleSelect(item.path)
                }
                onMouseEnter={() =>
                  setActiveIndex(idx)
                }
              >
                <div className="suggestion-icon">
                  <Icon size={16} />
                </div>

                <div className="suggestion-info">
                  <span className="suggestion-label">
                    {item.label}
                  </span>

                  <span className="suggestion-desc">
                    {item.description}
                  </span>
                </div>

                <ChevronRight
                  size={14}
                  className="suggestion-arrow"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [
    profileDropdownOpen,
    setProfileDropdownOpen
  ] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  const { state, dispatch } = useApp();

  const meta =
    ROUTE_META[location.pathname] ?? {
      label: 'Page',
      crumb: ['Home', 'Page']
    };

  const crumbs = meta.crumb;

  const unreadNotifications =
    state?.totalInterviews !== undefined && state?.totalInterviews > 0
      ? Math.min(state.totalInterviews, 9)
      : 2;

  const notificationsActive =
    location.pathname ===
    '/dashboard/notifications';

  const isActive = (path) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(path);

  return (
    <div className="dashboard-layout">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      <aside
        className={`sidebar glass-panel ${
          sidebarOpen ? 'open' : ''
        }`}
      >
        <div className="sidebar-header">
          <button
            className="logo"
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <BrainCircuit
              className="logo-icon"
              size={28}
            />

            <span className="logo-text">
              LastMinute
              <span className="accent">
                .ai
              </span>
            </span>
          </button>

          <button
            className="mobile-close-btn"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-nav-scroll">

  {/* MAIN */}
  <div className="nav-section">
    <p className="nav-section-title">
      MAIN
    </p>

    <SidebarItem
      icon={LayoutDashboard}
      label="Dashboard"
      path="/dashboard"
      active={isActive('/dashboard')}
    />

    <SidebarItem
      icon={FileText}
      label="Resume Analyzer"
      path="/dashboard/resume"
      active={isActive('/dashboard/resume')}
    />
  </div>

  {/* PRACTICE */}
  <div className="nav-section">
    <p className="nav-section-title">
      PRACTICE
    </p>

    <SidebarItem
      icon={Video}
      label="Mock Interviews"
      path="/dashboard/mock"
      active={isActive('/dashboard/mock')}
    />

    <SidebarItem
      icon={Code2}
      label="Coding Interview"
      path="/dashboard/coding"
      active={isActive('/dashboard/coding')}
    />

    <SidebarItem
      icon={Users}
      label="HR Trainer"
      path="/dashboard/hr"
      active={isActive('/dashboard/hr')}
    />

    <div className="panic-mode-wrapper">
  <SidebarItem
    icon={Zap}
    label="Panic Mode 🔥"
    path="/dashboard/panic"
    active={isActive('/dashboard/panic')}
    className="panic-mode-item"
  />
</div>

    <SidebarItem
      icon={Clock}
      label="Prep Sessions"
      path="/dashboard/prep"
      active={isActive('/dashboard/prep')}
    />
  </div>

  {/* INSIGHTS */}
  <div className="nav-section">
    <p className="nav-section-title">
      INSIGHTS
    </p>

    <SidebarItem
      icon={MessageSquare}
      label="AI Feedback"
      path="/dashboard/ai-feedback"
      active={isActive('/dashboard/ai-feedback')}
    />

    <SidebarItem
      icon={BarChart3}
      label="Analytics"
      path="/dashboard/analytics"
      active={isActive('/dashboard/analytics')}
    />

    <SidebarItem
      icon={History}
      label="History"
      path="/dashboard/history"
      active={isActive('/dashboard/history')}
    />
  </div>

  {/* ACCOUNT */}
  <div className="nav-section">
    <p className="nav-section-title">
      ACCOUNTS
    </p>

    <SidebarItem
      icon={Bell}
      label="Notifications"
      path="/dashboard/notifications"
      active={isActive('/dashboard/notifications')}
      badge={unreadNotifications}
    />

    <SidebarItem
      icon={Settings}
      label="Settings"
      path="/dashboard/settings"
      active={isActive('/dashboard/settings')}
    />

    <SidebarItem
      icon={LogOut}
      label="Logout"
      onClick={() => {
        localStorage.removeItem('token');

        dispatch({ type: 'LOGOUT' });

        navigate('/login');
      }}
      active={false}
    />
  </div>

</div>

      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header glass-panel">
          <div className="header-left">
            <button
              className="menu-btn"
              onClick={() =>
                setSidebarOpen(true)
              }
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>

            <div className="breadcrumbs">
              {crumbs.map((crumb, i) => (
                <span
                  key={i}
                  className="breadcrumb-item"
                >
                  {i <
                  crumbs.length - 1 ? (
                    <>
                      <span className="crumb-link">
                        {crumb}
                      </span>

                      <ChevronRight
                        size={14}
                        className="crumb-sep"
                      />
                    </>
                  ) : (
                    <span className="crumb-active">
                      {crumb}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <SearchBar />

          <div className="header-right">
            <button
              className="ai-assist-btn"
              onClick={() => {
                const event =
                  new CustomEvent(
                    'openAIChat'
                  );

                window.dispatchEvent(
                  event
                );
              }}
            >
              <BrainCircuit
              className="logo-icon"
              size={16}
            />

              <span className="btn-text">
                AI Assistant
              </span>
            </button>

            <Link
              to="/dashboard/notifications"
              className={`icon-btn notification-btn ${
                notificationsActive
                  ? 'active'
                  : ''
              }`}
              aria-label="Open notifications"
            >
              <Bell size={26} />

              
            </Link>

            <div className="user-profile profile-avatar-wrap">
              <button
                className={`avatar profile-avatar-btn ${
                  state?.isPro || true
                    ? 'profile-avatar-btn--pro'
                    : 'profile-avatar-btn--free'
                } ${
                  profileDropdownOpen
                    ? 'profile-avatar-btn--open'
                    : ''
                }`}
                onClick={() =>
                  setProfileDropdownOpen(
                    prev => !prev
                  )
                }
                aria-label="Toggle profile menu"
                aria-expanded={
                  profileDropdownOpen
                }
                aria-haspopup="menu"
              >
                {state?.userName
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  'N'}
              </button>

              <ProfileDropdown
                open={
                  profileDropdownOpen
                }
                onClose={() =>
                  setProfileDropdownOpen(
                    false
                  )
                }
                userName={state?.userName || 'User'}
                userInitials={
                  state?.userInitials || 'U'
                }
                predictedRole={
                  state?.predictedRole || 'Candidate'
                }
                onLogout={() => {
                  localStorage.removeItem(
                    'token'
                  );

                  dispatch({
                    type: 'LOGOUT'
                  });

                  navigate('/login');
                }}
                navigate={navigate}
              />
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <ErrorBoundary title="Dashboard Content Error" fallbackText="The main dashboard content view encountered an error. Please reload the page.">
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>

      <AIAssistant />

      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;