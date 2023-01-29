import React, { useState } from "react";

function NavBar() {
  const [activeTab, setActiveTab] = useState("Home");

  const handleClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="navbar-container">
      <div
        className={`navbar-tab ${activeTab === "Home" ? "active" : ""}`}
        onClick={() => handleClick("Home")}
      >
        Home
      </div>
      <div
        className={`navbar-tab ${activeTab === "Account" ? "active" : ""}`}
        onClick={() => handleClick("Account")}
      >
        Account
      </div>
    </div>
  );
}

export default NavBar;
