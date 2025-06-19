import React, { useState } from 'react';
import '../../styles/admin-styles/Settings.css';

const AdminSettings = () => {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);

  const handleThemeToggle = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleNotificationToggle = () => {
    setNotifications(prev => !prev);
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Admin Settings</h1>

      <div className="settings-section">
        <h2>Admin Info</h2>
        <div className="settings-field">
          <label>Name:</label>
          <input type="text" value="Admin Joven Tire" disabled />
        </div>
        <div className="settings-field">
          <label>Email:</label>
          <input type="email" value="admin@joventireenterprise.com" disabled />
        </div>
      </div>

      <div className="settings-section">
        <h2>Change Password</h2>
        <div className="settings-field">
          <label>New Password:</label>
          <input type="password" placeholder="Enter new password" />
        </div>
        <div className="settings-field">
          <label>Confirm Password:</label>
          <input type="password" placeholder="Confirm new password" />
        </div>
        <button className="settings-button">Update Password</button>
      </div>

      <div className="settings-section">
        <h2>Preferences</h2>
        <div className="settings-field toggle-field">
          <label>Theme Mode:</label>
          <button onClick={handleThemeToggle}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
        <div className="settings-field toggle-field">
          <label>Notifications:</label>
          <button onClick={handleNotificationToggle}>
            {notifications ? 'Disable' : 'Enable'} Notifications
          </button>
        </div>
      </div>

      <div className="settings-section danger-zone">
        <h2>Danger Zone</h2>
        <p>This action is irreversible.</p>
        <button className="danger-btn">Delete Admin Account</button>
      </div>
    </div>
  );
};

export default AdminSettings;
