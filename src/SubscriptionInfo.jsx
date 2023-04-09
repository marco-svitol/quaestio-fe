import React from 'react';
import './App.css';

const SubscriptionInfo = () => {
  // Display subscription information here.
  return (
    <div className="subscription-info">
      <h2>Subscription Information</h2>
      <div className="plan-details">
        <p>Plan: Premium</p>
        <p>Next Billing Date: May 1, 2023</p>
        <p>Payment Method: **** **** **** 1234</p>
      </div>
      <button className="upgrade-button">Upgrade Plan</button>
    </div>
  );
};

export default SubscriptionInfo;
