import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SearchBox from "./SearchBox";
import LoginBox from "./LoginBox";
import NavBar from "./NavBar";
import ReactGrid from "./ReactGrid";
import AccountPage from "./AccountPage";
import LogoutButton from "./LogoutButton";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import axios from "axios";

function isTokenExpired(token) {
  if (!token) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const tokenExp = decodedToken.exp;

  return currentTime >= tokenExp;
}

async function refreshToken() {
  const uid = sessionStorage.getItem("uid");
  const refToken = sessionStorage.getItem("reftoken");
  console.log("UID:", uid);
  console.log("RefToken:", refToken);

  if (isTokenExpired(refToken)) {
    console.log("Refresh token has expired");
    return;
  }

  try {
    const response = await axios.post(
      "https://quaestio-be.azurewebsites.net/api/v1/auth/refresh",
      {
        uid: uid,
        token: refToken,
      }
    );

    if (response.status === 200) {
      sessionStorage.setItem("token", response.data.token);
      console.log("Token refreshed");
    } else {
      console.log("Error refreshing token");
    }
  } catch (error) {
    console.log("Error refreshing token:", error);
  }
}
function App() {
  const [data, setData] = useState([]);
  const [, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isAuthenticated = () => {
    const token = sessionStorage.getItem("token");
    const refreshToken = sessionStorage.getItem("reftoken");
    return token || refreshToken;
  };

  useEffect(() => {
    if (isAuthenticated()) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/search" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/search" />
            ) : (
              <LoginBox setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/search"
          element={
            isLoggedIn ? (
              <>
                <NavBar isLoggedIn={isLoggedIn} />
                <div className="big-div">
                  <div className="app-container">
                    <SearchBox
                      setData={setData}
                      setError={setError}
                      refreshToken={refreshToken}
                    />
                    <ReactGrid data={data} />
                  </div>
                  <LogoutButton
                    handleLogout={handleLogout}
                    refreshToken={refreshToken}
                  />
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/account"
          element={
            isLoggedIn ? (
              <>
                <NavBar isLoggedIn={isLoggedIn} />
                <div className="big-div">
                  <AccountPage />
                </div>
                <LogoutButton
                  handleLogout={handleLogout}
                  refreshToken={refreshToken}
                />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
