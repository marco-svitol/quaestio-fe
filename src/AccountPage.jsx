import React from "react";
import "./App.css";
import UserProfile from "./UserProfile";
import AccountSettings from "./AccountSettings";
import SubscriptionInfo from "./SubscriptionInfo";
import UsageAnalytics from "./UsageAnalytics";
import AccessControls from "./AccessControls";
import HelpSupport from "./HelpSupport";

const AccountPage = () => {
  return (
    <div className="account-page">
      <UserProfile />
      <AccountSettings />
      <SubscriptionInfo />
      <UsageAnalytics />
      <AccessControls />
      <HelpSupport />
    </div>
  );
};

export default AccountPage;
