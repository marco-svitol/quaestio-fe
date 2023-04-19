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

async function refreshToken() {
  const uid = sessionStorage.getItem("uid");
  const refToken = sessionStorage.getItem("reftoken");
  console.log("UID:", uid);
  console.log("RefToken:", refToken);

  const currentTime = Math.floor(Date.now() / 1000);
  const decodedRefToken = JSON.parse(atob(refToken.split(".")[1]));
  const tokenExp = decodedRefToken.exp;

  if (currentTime >= tokenExp) {
    console.log("Refresh token has expired");
    return;
  }

  const url = new URL(
    `/api/v1/auth/refreshtoken?uid=${uid}&reftoken=${refToken}`,
    "https://quaestio-be.azurewebsites.net"
  );
  console.log("URL:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${refToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  console.log("Authorization header:", response.headers.get("Authorization"));

  if (!response.ok) {
    console.log("Error response:", response);
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();
  sessionStorage.setItem("token", data.token);
}

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
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
      {isLoggedIn && <LogoutButton handleLogout={handleLogout} />}
    </div>
  );
}

export default App;
