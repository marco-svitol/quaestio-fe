import React, { useState } from "react";
import "./App.css";

const AccountPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNewUsernameChange = (event) => {
    setNewUsername(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Update user information here by calling an API or updating the app state.
    console.log("Account information updated!");
    // Redirect to the homepage or another page after updating the account information.
  };

  return (
    <div className="account-page">
      <div className="account-page-container">
        <form className="account-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Current Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Current Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="newUsername">New Username:</label>
            <input
              type="text"
              id="newUsername"
              value={newUsername}
              onChange={handleNewUsernameChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
          </div>
          <button className="submit-button" type="submit">
            Update Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
