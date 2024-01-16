import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { Provider } from 'react-redux';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    authorizationParams={{
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      redirect_uri: window.location.origin
    }}
    >
    <Provider store={store}>
      <App />
    </Provider>
  </Auth0Provider>
);
