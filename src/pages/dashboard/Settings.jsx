import {
  Bell,
  Shield,
  User,
  Moon,
  Monitor,
  Lock,
  Palette,
  Globe,
  LogOut,
  Save,
  ChevronRight
} from "lucide-react";

import "./Settings.css";

export default function Settings() {
  return (
    <div className="settings-page">

      {/* HEADER */}
      <div className="settings-hero">
        <div>
          <h1>
            Settings <span>Center</span>
          </h1>
          <p>
            Manage your profile, security, notifications and platform
            preferences.
          </p>
        </div>

        <button className="save-settings-btn">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      {/* GRID */}
      <div className="settings-grid">

        {/* PROFILE */}
        <div className="settings-card">
          <div className="settings-card-title">
            <User size={18} />
            Profile Settings
          </div>

          <div className="settings-form">

            <div className="settings-input-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your name" />
            </div>

            <div className="settings-input-group">
              <label>Email Address</label>
              <input type="email" placeholder="Enter email" />
            </div>

            <div className="settings-input-group">
              <label>Bio</label>
              <textarea placeholder="Write something about yourself..." />
            </div>

          </div>
        </div>

        {/* APPEARANCE */}
        <div className="settings-card">
          <div className="settings-card-title">
            <Palette size={18} />
            Appearance
          </div>

          <div className="settings-options">

            <div className="settings-option active">
              <div className="option-left">
                <Moon size={18} />
                <span>Dark Mode</span>
              </div>

              <div className="premium-toggle active"></div>
            </div>

            <div className="settings-option">
              <div className="option-left">
                <Monitor size={18} />
                <span>System Theme</span>
              </div>

              <div className="premium-toggle"></div>
            </div>

          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="settings-card">
          <div className="settings-card-title">
            <Bell size={18} />
            Notifications
          </div>

          <div className="settings-options">

            <div className="settings-option active">
              <div className="option-left">
                <Bell size={18} />
                <span>Email Alerts</span>
              </div>

              <div className="premium-toggle active"></div>
            </div>

            <div className="settings-option">
              <div className="option-left">
                <Globe size={18} />
                <span>Marketing Updates</span>
              </div>

              <div className="premium-toggle"></div>
            </div>

          </div>
        </div>

        {/* SECURITY */}
        <div className="settings-card">
          <div className="settings-card-title">
            <Shield size={18} />
            Security
          </div>

          <div className="security-items">

            <div className="security-row">
              <div className="security-left">
                <Lock size={18} />
                <div>
                  <h4>Password</h4>
                  <p>Last updated 7 days ago</p>
                </div>
              </div>

              <ChevronRight size={18} />
            </div>

            <div className="security-row">
              <div className="security-left">
                <Shield size={18} />
                <div>
                  <h4>Two Factor Auth</h4>
                  <p>Disabled</p>
                </div>
              </div>

              <ChevronRight size={18} />
            </div>

          </div>
        </div>

      </div>

      {/* DANGER ZONE */}
      <div className="danger-zone">
        <div>
          <h3>Danger Zone</h3>
          <p>
            Logout from this device securely.
          </p>
        </div>

        <button className="logout-btn">
          <LogOut size={18} />
          Logout
        </button>
      </div>

    </div>
  );
}