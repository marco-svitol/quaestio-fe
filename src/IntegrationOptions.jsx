import React from 'react';
import { FaGoogle, FaGithub, FaSlack } from 'react-icons/fa';
import { SiSalesforce, SiZendesk, SiShopify } from 'react-icons/si';
import './App.css';

const IntegrationOptions = () => {
  return (
    <div className="integration-options-container">
      <h2 className="integration-options-title">Integration Options</h2>
      <div className="integration-options-grid">
        <div className="integration-option">
          <FaGoogle className="integration-icon" />
          <h3 className="integration-name">Google Analytics</h3>
        </div>
        <div className="integration-option">
          <SiSalesforce className="integration-icon" />
          <h3 className="integration-name">Salesforce</h3>
        </div>
        <div className="integration-option">
          <FaGithub className="integration-icon" />
          <h3 className="integration-name">GitHub</h3>
        </div>
        <div className="integration-option">
          <SiZendesk className="integration-icon" />
          <h3 className="integration-name">Zendesk</h3>
        </div>
        <div className="integration-option">
          <FaSlack className="integration-icon" />
          <h3 className="integration-name">Slack</h3>
        </div>
        <div className="integration-option">
          <SiShopify className="integration-icon" />
          <h3 className="integration-name">Shopify</h3>
        </div>
      </div>
    </div>
  );
};

export default IntegrationOptions;
