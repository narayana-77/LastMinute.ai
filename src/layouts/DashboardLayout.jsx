import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BrainCircuit, LayoutDashboard, FileText, Video, Code2, Users,
  Target, Zap, BarChart3, History, Settings, LogOut,
  Bell, Search, Menu, X, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ToastContainer from '../components/Toast';
import AIAssistant from '../components/AIAssistant';
import ProfileDropdown from '../components/ProfileDropdown';
import './DashboardLayout.css';

const ROUTE_META = {
  '/dashboard':                { label: 'Dashboard',        crumb: ['Home', 'Dashboard'] },
  '/dashboard/resume':         { label: 'Resume Analyzer',  crumb: ['Home', 'Resume Analyzer'] },
  '/dashboard/mock':           { label: 'Mock Interviews',  crumb: ['Home', 'Mock Interviews'] },
  '/dashboard/coding':         { label: 'Coding Interview', crumb: ['Home', 'Coding Interview'] },
  '/dashboard/hr':             { label: 'HR Trainer',       crumb: ['Home', 'HR Trainer'] },
  '/dashboard/panic':          { label: 'Panic Mode 🔥',    crumb: ['Home', 'Panic Mode'] },
  '/dashboard/analytics':      { label: 'Analytics',        crumb: ['Home', 'Analytics'] },
  '/dashboard/history':        { label: 'History',          crumb: ['Home', 'History'] },
  '/dashboard/settings':       { label: 'Settings',         crumb: ['Home', 'Settings'] },
  '/dashboard/notifications':  { label: 'Notifications',    crumb: ['Home', 'Notifications'] },
  '/dashboard/profile':        { label: 'My Profile',       crumb: ['Home', 'Profile'] },
};

const SEARCH_MODULES = [
  { label: 'Dashboard',         path: '/dashboard',                   icon: LayoutDashboard, description: 'Overview of your interview prep' },
  { label: 'Resume Analyzer',   path: '/dashboard/resume',            icon: FileText,       description: 'Upload and analyze your resume' },
  { label: 'Mock Interviews',   path: '/dashboard/mock',              icon: Video,          description: 'Practice mock interview rounds' },
  { label: 'Coding Interview',  path: '/dashboard/coding',            icon: Code2,          description: 'Solve coding challenges' },
  { label: 'HR Trainer',        path: '/dashboard/hr',                icon: Users,          description: 'Prepare for HR rounds' },
  { label: 'Domain Prep',       path: '/dashboard/domain',            icon: Target,         description: 'Domain-specific preparation' },
  { label: 'Panic Mode',        path: '/dashboard/panic',             icon: Zap,            description: 'Last minute interview prep' },
  { label: 'Analytics',         path: '/dashboard/analytics',         icon: BarChart3,      description: 'View your performance analytics' },
  { label: 'History',           path: '/dashboard/history',           icon: History,        description: 'Your interview history' },
  { label: 'Settings',          path: '/dashboard/settings',          icon: Settings,       description: 'Manage your account settings' },
  { label: 'Notifications',     path: '/dashboard/notifications',     icon: Bell,           description: 'View your alerts and updates' },
];

const SidebarItem = ({ icon: Icon, label, path, active, badge }) => (
  <Link to={path} className={`sidebar-item ${active ? 'active' : ''}`}>
    <Icon size={20} className="sidebar-icon" />
    <span className="sidebar-label">{label}</span>
    {badge && <span className="sidebar-badge">{badge}</span>}
  </Link>
);

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
      m => m.label.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    );
    setSuggestions(filtered);
    setShowDropdown(filtered.length > 0);
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (path) => {
    setQuery('');
    setShowDropdown(false);
    navigate(path);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    else if (e.key === 'ArrowUp') setActiveIndex(prev => Math.max(prev - 1, 0));
    else if (e.key === 'Enter' && activeIndex >= 0) handleSelect(suggestions[activeIndex].path);
    else if (e.key === 'Escape') setShowDropdown(false);
  };

  return (
    <div className="search-wrapper">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search modules…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowDropdown(suggestions.length > 0)}
          autoComplete="off"
        />
        {query && (
          <button
            className="search-clear-btn"
            onClick={() => { setQuery(''); setShowDropdown(false); }}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="search-dropdown" ref={dropdownRef}>
          {suggestions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.path}
                className={`search-suggestion ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => handleSelect(item.path)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <div className="suggestion-icon"><Icon size={16} /></div>
                <div className="suggestion-info">
                  <span className="suggestion-label">{item.label}</span>
                  <span className="suggestion-desc">{item.description}</span>
                </div>
                <ChevronRight size={14} className="suggestion-arrow" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const meta = ROUTE_META[location.pathname] ?? { label: 'Page', crumb: ['Home', 'Page'] };
  const crumbs = meta.crumb;
  const unreadNotifications = state.totalInterviews > 0 ? Math.min(state.totalInterviews, 9) : 0;
  const notificationsActive = location.pathname === '/dashboard/notifications';

  const isActive = (path) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(path);

  return (
    <div className="dashboard-layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar glass-panel ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button
            className="logo"
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <BrainCircuit className="logo-icon" size={28} />
            <span className="logo-text">LastMinute<span className="accent">.ai</span></span>
          </button>
          <button className="mobile-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-user-pill">
          <div className="avatar sm">{state.userInitials}</div>
          <div className="sideuser-info">
            <p className="sideuser-name">{state.userName}</p>
            <p className="sideuser-role">{state.predictedRole ?? 'Profile not analyzed'}</p>
          </div>
        </div>

        <div className="sidebar-nav-scroll">
          <div className="nav-section">
            <p className="nav-section-title">MAIN</p>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" active={isActive('/dashboard')} />
            <SidebarItem icon={FileText} label="Resume Analyzer" path="/dashboard/resume" active={isActive('/dashboard/resume')} badge={state.resumeAnalyzed ? '✓' : null} />
          </div>

          <div className="nav-section">
            <p className="nav-section-title">PRACTICE</p>
            <SidebarItem icon={Video} label="Mock Interviews" path="/dashboard/mock" active={isActive('/dashboard/mock')} badge={state.mockScore || null} />
            <SidebarItem icon={Code2} label="Coding Interview" path="/dashboard/coding" active={isActive('/dashboard/coding')} badge={state.codingScore || null} />
            <SidebarItem icon={Users} label="HR Trainer" path="/dashboard/hr" active={isActive('/dashboard/hr')} badge={state.hrScore || null} />
            <SidebarItem icon={Target} label="Domain Prep" path="/dashboard/domain" active={isActive('/dashboard/domain')} />
            <SidebarItem icon={Zap} label="Panic Mode" path="/dashboard/panic" active={isActive('/dashboard/panic')} />
          </div>

          <div className="nav-section">
            <p className="nav-section-title">REPORTS</p>
            <SidebarItem icon={BarChart3} label="Analytics" path="/dashboard/analytics" active={isActive('/dashboard/analytics')} badge={state.totalInterviews > 0 ? state.totalInterviews : null} />
            <SidebarItem icon={History} label="History" path="/dashboard/history" active={isActive('/dashboard/history')} />
            <SidebarItem icon={Bell} label="Notifications" path="/dashboard/notifications" active={isActive('/dashboard/notifications')} badge={unreadNotifications || null} />
          </div>
        </div>

        <div className="sidebar-footer">
          <SidebarItem icon={Settings} label="Settings" path="/dashboard/settings" active={isActive('/dashboard/settings')} />
          <button
            onClick={() => {
              localStorage.removeItem('token');
              dispatch({ type: 'LOGOUT' });
              navigate('/login');
            }}
            className="sidebar-item logout-btn w-full text-left"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <LogOut size={20} className="sidebar-icon" />
            <span className="sidebar-label">Logout</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header glass-panel">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <Menu size={24} />
            </button>

            <div className="breadcrumbs">
              {crumbs.map((crumb, i) => (
                <span key={i} className="breadcrumb-item">
                  {i < crumbs.length - 1 ? (
                    <>
                      <span className="crumb-link" onClick={() => navigate('/')}>{crumb}</span>
                      <ChevronRight size={14} className="crumb-sep" />
                    </>
                  ) : (
                    <span className="crumb-active">{crumb}</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="header-right">
            <SearchBar />

            {state.overallReadiness != null && (
              <div className="readiness-pill">
                <span className="rp-label">Ready</span>
                <span className="rp-val">{state.overallReadiness}%</span>
              </div>
            )}

            <button
              className="ai-assist-btn"
              onClick={() => {
                const event = new CustomEvent('openAIChat');
                window.dispatchEvent(event);
              }}
            >
              <BrainCircuit size={18} />
              <span className="btn-text">AI Assistant</span>
            </button>

            <Link
              to="/dashboard/notifications"
              className={`icon-btn notification-btn ${notificationsActive ? 'active' : ''}`}
              aria-label={`Open notifications${unreadNotifications ? `, ${unreadNotifications} unread` : ''}`}
            >
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <>
                  <span className="notification-ping"></span>
                  <span className="notification-dot"></span>
                  <span className="notification-count">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                </>
              )}
            </Link>

            <div className="user-profile profile-avatar-wrap">
              <button
                className={`avatar profile-avatar-btn ${profileDropdownOpen ? 'profile-avatar-btn--open' : ''}`}
                onClick={() => setProfileDropdownOpen(prev => !prev)}
                aria-label="Toggle profile menu"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="menu"
              >
                {state.userInitials}
              </button>
              <ProfileDropdown
                open={profileDropdownOpen}
                onClose={() => setProfileDropdownOpen(false)}
                userName={state.userName}
                userInitials={state.userInitials}
                predictedRole={state.predictedRole}
                onLogout={() => {
                  localStorage.removeItem('token');
                  dispatch({ type: 'LOGOUT' });
                  navigate('/login');
                }}
                navigate={navigate}
              />
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>

      <AIAssistant />
      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;