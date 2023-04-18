import React, { useState } from "react";
import SearchBox from "./SearchBox";
import LoginBox from "./LoginBox";
import NavBar from "./NavBar";
import ReactGrid from "./ReactGrid";
import AccountPage from "./AccountPage";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [setError] = useState(null);
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
          <LoginBox toggleDisplay={toggleDisplay} />
        ) : (
          <>
            {activeTab === "Home" && (
              <div className="app-container">
                <SearchBox setData={setData} setError={setError} />
                <ReactGrid data={data} />
              </div>
            )}
            {activeTab === "Account" && <AccountPage />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
