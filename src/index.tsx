import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import reportWebVitals from './reportWebVitals';
require(`bootswatch/dist/cerulean/bootstrap.min.css`);
import './index.css';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import keycloak from 'keycloak';
import { checkExpirationTime, matchAuthStateToSSO } from 'keycloak';
import { doLogOut } from 'redux/actions/user';
import { unregister } from 'registerserviceworker';

function prepareAuth() {
  // If a persisted ICAT session was just restored, make sure it's not expired (or about to expire)
  checkExpirationTime();
  if (keycloak) {
    // When keycloak detects a log out or fails to refresh the access token, log out from ICAT
    keycloak.onAuthLogout = () => {
      if (store.getState().user.isSSO) {
        store.dispatch(doLogOut());
      }
    };

    // Make sure ICAT authentication state is consistent with SSO (i.e. log in/out as needed)
    matchAuthStateToSSO();
  }
}
function renderApp() {
  render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate onBeforeLift={prepareAuth} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

if (keycloak) {
  // Initialise SSO before rendering the app
  keycloak
    .init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    })
    .then(renderApp);
} else {
  renderApp();
}

// Remove any installed service worker
unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
