import React from "react";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();

  return (
    <div className="navbar-container">
      <Link
        className={`navbar-tab ${
          location.pathname === "/search" ? "active" : ""
        }`}
        to="/search"
      >
        Home
      </Link>
      <Link
        className={`navbar-tab ${
          location.pathname === "/account" ? "active" : ""
        }`}
        to="/account"
      >
        Account
      </Link>
    </div>
  );
}

export default NavBar;
