import { useEffect, useRef } from 'react';
import { User, LayoutDashboard, Settings, Bell, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import './ProfileDropdown.css';

const MENU_ITEMS = [
  { icon: User,          label: 'My Profile',    path: '/dashboard/profile',       accent: 'cyan'   },
  { icon: LayoutDashboard,label:'Dashboard',     path: '/dashboard',               accent: 'purple' },
  { icon: Settings,      label: 'Settings',      path: '/dashboard/settings',      accent: 'purple' },
  { icon: Bell,          label: 'Notifications', path: '/dashboard/notifications', accent: 'cyan', badge: 3 },
];

const ProfileDropdown = ({ open, onClose, userName, userInitials, predictedRole, onLogout, navigate }) => {
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    // slight delay so the toggle click doesn't immediately close
    const t = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handler); };
  }, [open, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleNav = (path) => { navigate(path); onClose(); };

  return (
    <div
      ref={ref}
      className={`pd ${open ? 'pd--open' : ''}`}
      role="menu"
      aria-hidden={!open}
    >
      {/* Arrow pointer */}
      <div className="pd__arrow" />

      {/* User identity strip */}
      <div className="pd__user">
        <div className="pd__user-avatar">
          {userInitials}
          <span className="pd__user-avatar-ring" />
        </div>
        <div className="pd__user-info">
          <p className="pd__user-name">{userName || 'User'}</p>
          <p className="pd__user-role">
            <Sparkles size={10} style={{ display:'inline', marginRight:3 }} />
            {predictedRole || 'Profile not analyzed'}
          </p>
        </div>
      </div>

      <div className="pd__divider" />

      {/* Menu items */}
      <nav className="pd__nav">
        {MENU_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              className={`pd__item pd__item--${item.accent}`}
              onClick={() => handleNav(item.path)}
              role="menuitem"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className={`pd__item-icon pd__item-icon--${item.accent}`}>
                <Icon size={15} />
              </span>
              <span className="pd__item-label">{item.label}</span>
              {item.badge ? (
                <span className="pd__item-badge">{item.badge}</span>
              ) : (
                <ChevronRight size={13} className="pd__item-arrow" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="pd__divider" />

      {/* Logout */}
      <button className="pd__logout" onClick={() => { onLogout(); onClose(); }} role="menuitem">
        <LogOut size={15} />
        <span>Sign out</span>
      </button>
    </div>
  );
};

export default ProfileDropdown;