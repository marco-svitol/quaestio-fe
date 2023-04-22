import React, { useState } from "react";
import "./App.css";

const AccountSettings = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmNewPasswordChange = (event) => {
    setConfirmNewPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Update user settings here by calling an API or updating the app state.
    console.log("Account settings updated!");
    // Redirect to the homepage or another page after updating the account settings.
  };

  return (
    <div className="account-settings">
      <div className="disabled-component">
        <h2>Account Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="setting-group">
            <label htmlFor="password">Current Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="setting-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
          </div>
          <div className="setting-group">
            <label htmlFor="confirmNewPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={handleConfirmNewPasswordChange}
            />
          </div>
          <button className="submit-button" type="submit">
            Update Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
