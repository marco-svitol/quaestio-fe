import React from 'react';
import './App.css';
import UserProfile from './UserProfile';
import AccountSettings from './AccountSettings';
import SubscriptionInfo from './SubscriptionInfo';
import UsageAnalytics from './UsageAnalytics';
import AccessControls from './AccessControls';
import HelpSupport from './HelpSupport';
import IntegrationOptions from './IntegrationOptions';

const AccountPage = () => {
  return (
    <div className="account-page">
      <UserProfile />
      <AccountSettings />
      <SubscriptionInfo />
      <UsageAnalytics />
      <AccessControls />
      <HelpSupport />
      <IntegrationOptions />
    </div>
  );
};

export default AccountPage;
