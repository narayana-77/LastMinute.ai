import { useMemo, useState } from 'react';
import {
  Bell,
  Bot,
  FileText,
  ShieldCheck,
  Sparkles,
  Clock3,
  CheckCheck,
  Inbox
} from 'lucide-react';
import './NotificationsPage.css';

const initialNotifications = [
  {
    id: 1,
    type: 'ai',
    title: 'AI mock interview feedback is ready',
    message: 'Your latest interview session has been analyzed with strengths, weak spots, and improvement tips.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    type: 'resume',
    title: 'Resume score improved',
    message: 'Your updated resume increased its ATS compatibility after the latest optimization.',
    time: '18 min ago',
    unread: true,
  },
  {
    id: 3,
    type: 'security',
    title: 'Security check completed',
    message: 'Your account activity was verified and no unusual sign-in attempts were detected.',
    time: 'Today, 6:40 PM',
    unread: false,
  },
  {
    id: 4,
    type: 'system',
    title: 'New prep recommendation unlocked',
    message: 'A new personalized practice track is available based on your recent mock and coding results.',
    time: 'Yesterday',
    unread: false,
  },
];

const typeMap = {
  ai: Bot,
  resume: FileText,
  security: ShieldCheck,
  system: Sparkles,
};

const NotificationCard = ({ item, onToggle }) => {
  const Icon = typeMap[item.type] || Bell;

  return (
    <article className={`notification-card glass-panel ${item.unread ? 'unread' : ''}`}>
      <div className={`notification-icon-wrap ${item.type}`}>
        <Icon size={18} />
      </div>

      <div className="notification-body">
        <div className="notification-topline">
          <div className="notification-title-wrap">
            <h3 className="notification-title">{item.title}</h3>
            {item.unread && <span className="notification-unread-badge" />}
          </div>

          <div className="notification-time">
            <Clock3 size={14} />
            <span>{item.time}</span>
          </div>
        </div>

        <p className="notification-message">{item.message}</p>

        <div className="notification-actions">
          <button className="mark-read-btn" onClick={() => onToggle(item.id)}>
            <CheckCheck size={15} />
            <span>{item.unread ? 'Mark as read' : 'Mark as unread'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications]
  );

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: !item.unread } : item
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  return (
    <section className="notifications-page">
      <div className="notifications-hero glass-panel">
        <div>
          <div className="notifications-chip">
            <Bell size={14} />
            <span>Notification Center</span>
          </div>
          <h1>Notifications</h1>
          <p>
            Track interview updates, AI feedback, account alerts, and personalized prep reminders in one place.
          </p>
        </div>

        <div className="notifications-hero-actions">
          <div className="notifications-stat">
            <span className="stat-label">Unread</span>
            <span className="stat-value">{unreadCount}</span>
          </div>

          <button className="mark-all-btn" onClick={markAllAsRead}>
            <CheckCheck size={16} />
            <span>Mark all as read</span>
          </button>
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="notifications-list">
          {notifications.map((item) => (
            <NotificationCard key={item.id} item={item} onToggle={toggleRead} />
          ))}
        </div>
      ) : (
        <div className="notifications-empty glass-panel">
          <div className="empty-icon">
            <Inbox size={28} />
          </div>
          <h2>All caught up</h2>
          <p>No new notifications right now. Fresh updates will appear here as you continue preparing.</p>
        </div>
      )}
    </section>
  );
};

export default NotificationsPage;