import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import reportWebVitals from './reportWebVitals';
require(`bootswatch/dist/flatly/bootstrap.min.css`);
import './index.css';
import { Provider } from 'react-redux';
import { store, persistor } from './store';

import { unregister } from 'registerserviceworker';
function renderApp() {
  render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

renderApp();

// Remove any installed service worker
unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
