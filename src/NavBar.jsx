import React from "react";

function NavBar({ handleTabChange, activeTab }) {
  return (
    <div className="navbar-container">
      <div
        className={`navbar-tab ${activeTab === "Home" ? "active" : ""}`}
        onClick={() => handleTabChange("Home")}
      >
        Home
      </div>
      <div
        className={`navbar-tab ${activeTab === "Account" ? "active" : ""}`}
        onClick={() => handleTabChange("Account")}
      >
        Account
      </div>
    </div>
  );
}

export default NavBar;
