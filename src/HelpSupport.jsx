import React from "react";
import "./App.css";

const HelpSupport = () => {
  return (
    <div className="help-support">
      <div className="disabled-component">
        <h2>Help & Support</h2>
        <ul>
          <li>
            <a
              href="https://example.com/faq"
              target="_blank"
              rel="noopener noreferrer"
            >
              FAQ
            </a>
          </li>
          <li>
            <a
              href="https://example.com/documentation"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
          </li>
          <li>
            <a
              href="https://example.com/support"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Support
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HelpSupport;
