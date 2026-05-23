import { useEffect, useRef } from 'react';
import {
  User,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';

import './ProfileDropdown.css';

const MENU_ITEMS = [
  {
    icon: User,
    label: 'My Profile',
    path: '/dashboard/profile',
    accent: 'cyan'
  },

  {
    icon: Sparkles,
    label: 'Upgrade to Pro',
    path: '/dashboard/upgrade',
    accent: 'gold'
  },

  {
    icon: Settings,
    label: 'Settings',
    path: '/dashboard/settings',
    accent: 'purple'
  },

  {
    icon: Bell,
    label: 'Interview Alerts',
    path: '/dashboard/notifications',
    accent: 'cyan',
    badge: 3
  }
];

const ProfileDropdown = ({
  open,
  onClose,
  userName,
  userInitials,
  predictedRole,
  onLogout,
  navigate
}) => {
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };

    const timeout = setTimeout(() => {
      document.addEventListener('mousedown', handler);
    }, 0);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousedown', handler);
    };
  }, [open, onClose]);

  // Close dropdown on Escape key
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [open, onClose]);

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      ref={ref}
      className={`pd ${open ? 'pd--open' : ''}`}
      role="menu"
      aria-hidden={!open}
    >
      {/* Arrow */}
      <div className="pd__arrow" />

      {/* User Section */}
      <div className="pd__user">
        <div className="pd__user-avatar">
          {userInitials || 'U'}
          <span className="pd__user-avatar-ring" />
        </div>

        <div className="pd__user-info">
          <p className="pd__user-name truncate">
            {userName || 'User'}
          </p>

          <p className="pd__user-role">
            <Sparkles
              size={10}
              style={{
                display: 'inline',
                marginRight: 4
              }}
            />

            {predictedRole || 'Complete profile analysis'}
          </p>
        </div>
      </div>

      <div className="pd__divider" />

      {/* Menu Items */}
      <nav className="pd__nav">
        {MENU_ITEMS.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              className={`pd__item pd__item--${item.accent}`}
              onClick={() => handleNavigation(item.path)}
              role="menuitem"
              style={{
                animationDelay: `${index * 40}ms`
              }}
            >
              {/* Icon */}
              <span
                className={`pd__item-icon pd__item-icon--${item.accent}`}
              >
                <Icon size={15} />
              </span>

              {/* Label */}
              <span className="pd__item-label">
                {item.label}
              </span>

              {/* PRO Badge */}
              {item.label === 'Upgrade to Pro' && (
                <span className="pd__pro-badge">
                  PRO
                </span>
              )}

              {/* Notification Badge */}
              {item.badge ? (
                <span className="pd__item-badge">
                  {item.badge}
                </span>
              ) : (
                <ChevronRight
                  size={13}
                  className="pd__item-arrow"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="pd__divider" />

      {/* Logout */}
      <button
        className="pd__logout"
        onClick={() => {
          onLogout();
          onClose();
        }}
        role="menuitem"
      >
        <LogOut size={15} />
        <span>Sign out</span>
      </button>
    </div>
  );
};

export default ProfileDropdown;