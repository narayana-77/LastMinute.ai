import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BrainCircuit, LayoutDashboard, FileText, Video, Code2, Users,
  Target, Zap, BarChart3, History, Settings, LogOut,
  Bell, Search, Menu, X, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ToastContainer from '../components/Toast';
import './DashboardLayout.css';

// ── Route metadata ────────────────────────────────────────────────────────────
const ROUTE_META = {
  '/dashboard':          { label: 'Dashboard',         crumb: ['Home', 'Dashboard']         },
  '/dashboard/resume':   { label: 'Resume Analyzer',   crumb: ['Home', 'Resume Analyzer']   },
  '/dashboard/mock':     { label: 'Mock Interviews',   crumb: ['Home', 'Mock Interviews']   },
  '/dashboard/coding':   { label: 'Coding Interview',  crumb: ['Home', 'Coding Interview']  },
  '/dashboard/hr':       { label: 'HR Trainer',        crumb: ['Home', 'HR Trainer']        },
  '/dashboard/panic':    { label: 'Panic Mode 🔥',     crumb: ['Home', 'Panic Mode']        },
  '/dashboard/analytics':{ label: 'Analytics',         crumb: ['Home', 'Analytics']         },
  '/dashboard/history':  { label: 'History',           crumb: ['Home', 'History']           },
  '/dashboard/settings': { label: 'Settings',          crumb: ['Home', 'Settings']          },
};

const SidebarItem = ({ icon: Icon, label, path, active, badge }) => (
  <Link to={path} className={`sidebar-item ${active ? 'active' : ''}`}>
    <Icon size={20} className="sidebar-icon" />
    <span className="sidebar-label">{label}</span>
    {badge && <span className="sidebar-badge">{badge}</span>}
  </Link>
);

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { state, dispatch } = useApp();

  const meta   = ROUTE_META[location.pathname] ?? { label: 'Page', crumb: ['Home', 'Page'] };
  const crumbs = meta.crumb;

  const isActive = (path) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(path);

  return (
    <div className="dashboard-layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`sidebar glass-panel ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <BrainCircuit className="logo-icon" size={28} />
            <span className="logo-text">LastMinute<span className="accent">.ai</span></span>
          </Link>
          <button className="mobile-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* User pill */}
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
            <SidebarItem icon={LayoutDashboard} label="Dashboard"       path="/dashboard"          active={isActive('/dashboard')} />
            <SidebarItem icon={FileText}        label="Resume Analyzer" path="/dashboard/resume"   active={isActive('/dashboard/resume')}
              badge={state.resumeAnalyzed ? '✓' : null} />
          </div>

          <div className="nav-section">
            <p className="nav-section-title">PRACTICE</p>
            <SidebarItem icon={Video}   label="Mock Interviews"  path="/dashboard/mock"    active={isActive('/dashboard/mock')}
              badge={state.mockScore ? state.mockScore : null} />
            <SidebarItem icon={Code2}   label="Coding Interview" path="/dashboard/coding"  active={isActive('/dashboard/coding')}
              badge={state.codingScore ? state.codingScore : null} />
            <SidebarItem icon={Users}   label="HR Trainer"       path="/dashboard/hr"      active={isActive('/dashboard/hr')}
              badge={state.hrScore ? state.hrScore : null} />
            <SidebarItem icon={Target}  label="Domain Prep"      path="/dashboard/domain"  active={isActive('/dashboard/domain')} />
            <SidebarItem icon={Zap}     label="Panic Mode"       path="/dashboard/panic"   active={isActive('/dashboard/panic')} />
          </div>

          <div className="nav-section">
            <p className="nav-section-title">REPORTS</p>
            <SidebarItem icon={BarChart3} label="Analytics" path="/dashboard/analytics" active={isActive('/dashboard/analytics')}
              badge={state.totalInterviews > 0 ? state.totalInterviews : null} />
            <SidebarItem icon={History}   label="History"   path="/dashboard/history"   active={isActive('/dashboard/history')} />
          </div>
        </div>

        <div className="sidebar-footer">

  <SidebarItem
    icon={Settings}
    label="Settings"
    path="/dashboard/settings"
    active={isActive('/dashboard/settings')}
  />

  <button
    onClick={() => {
      localStorage.removeItem("token");

      dispatch({
        type: "LOGOUT",
      });

      navigate("/login");
    }}
    className="sidebar-item logout-btn w-full text-left"
    style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    }}
  >
    <LogOut size={20} className="sidebar-icon" />
    <span className="sidebar-label">Logout</span>
  </button>

</div>
      </aside>

      {/* ── Main ── */}
      <main className="dashboard-main">
        <header className="dashboard-header glass-panel">
          <div className="header-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="breadcrumbs">
              {crumbs.map((crumb, i) => (
                <span key={i} className="breadcrumb-item">
                  {i < crumbs.length - 1
                    ? <><span className="crumb-link" onClick={() => navigate('/dashboard')}>{crumb}</span><ChevronRight size={14} className="crumb-sep" /></>
                    : <span className="crumb-active">{crumb}</span>
                  }
                </span>
              ))}
            </div>
          </div>

          <div className="header-right">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search modules…" />
            </div>

            {/* Readiness pill */}
            {state.overallReadiness != null && (
              <div className="readiness-pill" title="Overall Readiness">
                <span className="rp-label">Ready</span>
                <span className="rp-val">{state.overallReadiness}%</span>
              </div>
            )}

            <button className="ai-assist-btn">
              <BrainCircuit size={18} />
              <span className="btn-text">AI Assistant</span>
            </button>

            <button className="icon-btn notification-btn">
              <Bell size={20} />
              {state.totalInterviews > 0 && <span className="notification-dot"></span>}
            </button>

            <div className="user-profile">
              <div className="avatar">{state.userInitials}</div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>

      {/* Global toasts */}
      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;
