import React, { useState } from "react";
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
  const [isLoginDisplayed, setIsLoginDisplayed] = useState(true);
  const [activeTab, setActiveTab] = useState("Home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleDisplay = () => {
    setIsLoginDisplayed(!isLoginDisplayed);
    setIsLoggedIn(!isLoggedIn);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    toggleDisplay();
  };

  return (
    <div className="App">
      {isLoggedIn && (
        <NavBar
          handleTabChange={handleTabChange}
          activeTab={activeTab}
          isLoggedIn={isLoggedIn}
        />
      )}
      <div className="big-div">
        {isLoginDisplayed ? (
          <LoginBox
            toggleDisplay={toggleDisplay}
            setIsLoggedIn={setIsLoggedIn}
          />
        ) : (
          <>
            {activeTab === "Home" && (
              <div className="app-container">
                <SearchBox
                  setData={setData}
                  setError={setError}
                  refreshToken={refreshToken}
                />
                <ReactGrid data={data} />
              </div>
            )}
            {activeTab === "Account" && <AccountPage />}
          </>
        )}
      </div>
      {isLoggedIn && (
        <LogoutButton handleLogout={handleLogout} refreshToken={refreshToken} />
      )}
    </div>
  );
}

export default App;
