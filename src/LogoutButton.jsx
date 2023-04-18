import React from "react";
import "./App.css";

function LogoutButton({ handleLogout }) {
  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;
