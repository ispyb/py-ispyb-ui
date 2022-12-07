import React from 'react';
import { createRoot } from 'react-dom/client';
import { CacheProvider } from 'rest-hooks';

import SuspenseRouter from './SuspenseRouter';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import './scss/main.scss';
import { AuthProvider } from 'hooks/useAuth';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <CacheProvider>
      <AuthProvider>
        <SuspenseRouter>
          <App />
        </SuspenseRouter>
      </AuthProvider>
    </CacheProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
