import React, { useState } from "react";
import "./App.css";

const UserProfile = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [profilePicture, setProfilePicture] = useState(
    "https://via.placeholder.com/150"
  );

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleProfilePictureChange = (event) => {
    setProfilePicture(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div className="user-profile">
      <div className="disabled-component">
        <h2>User Profile</h2>
        <div className="profile-picture">
          <img src={profilePicture} alt="Profile" />
          <input type="file" onChange={handleProfilePictureChange} />
        </div>
        <div className="user-details">
          <div className="user-detail">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <div className="user-detail">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
