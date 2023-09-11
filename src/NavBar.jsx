import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "./constants";

function NavBar() {
  const [logoPath, setLogoPath] = useState("");
  const location = useLocation();

  useEffect(() => {
    (async function () {
      try {
        const token = sessionStorage.getItem("token");
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const uid = decodedToken.uid;
        const userProfile = await getUserProfile(uid, token);

        const profile = userProfile[0];

        setLogoPath(profile.userinfo.logopath);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  async function getUserProfile(uid, token) {
    const url = new URL(
      `${API_BASE_URL}/api/v2/userprofile`
    );

    url.search = new URLSearchParams({ uid });

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();

    return data;
  }

  return (
    <div className="navbar-container">
      <div className="navbar-links">
        <Link
          className={`navbar-tab ${
            location.pathname === "/search" ? "active" : ""
          }`}
          to="/search"
        >
          Home
        </Link>
        <div className="logo-container">
          <img className="logo" src={logoPath} alt="logo" />
        </div>
        <Link
          className={`navbar-tab ${
            location.pathname === "/account" ? "active" : ""
          }`}
          to="/account"
        >
          Account
        </Link>
      </div>
    </div>
  );
}
export default NavBar;
