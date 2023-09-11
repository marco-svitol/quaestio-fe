import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { API_BASE_URL } from "./constants";

const LoginBox = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function loginUser(username, password) {
    const url = new URL(
      "/v1/auth/login",
      "http://localhost:8080/api/"
    );
    console.log(`url : ${API_BASE_URL}`);
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
      navigate("/search");
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
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <div className="show-password-wrapper">
            <input
              type="checkbox"
              id="showPassword"
              className="show-password-checkbox"
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword" className="show-password-label">
              Show password
            </label>
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
