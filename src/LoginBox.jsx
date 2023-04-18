import React, { useState } from "react";
import "./App.css";

const LoginBox = ({ toggleDisplay, setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function loginUser(username, password) {
    const url = new URL(
      "/api/v1/auth/login",
      "https://quaestio-be.azurewebsites.net"
    );
    url.searchParams.append("username", username);
    url.searchParams.append("password", password);

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return response.json();
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Username:", username, "Password:", password);

    try {
      const response = await loginUser(username, password);
      console.log("API response:", response); // Log the response
      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("reftoken", response.refreshtoken);
      sessionStorage.setItem("uid", response.uid);
      setIsLoggedIn(true);
      toggleDisplay();
    } catch (error) {
      console.error("Error:", error); // Log any errors
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-wrapper">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <div className="input-group">
            <div className="input-wrapper">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginBox;
