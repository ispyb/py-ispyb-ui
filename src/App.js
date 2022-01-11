import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import Menu from 'pages/menu/menu';
import LoginPage from 'components/login/loginpage';
import { setSite } from 'redux/actions/site';
import sites from 'config/sites';
import SessionsPage from 'pages/sessionspage';
import ProposalsPage from 'pages/proposalspage';
import ShippingPage from 'pages/shippingpage';
import PreparePage from 'pages/preparepage';
import ErrorBoundary from 'components/errors/errorboundary';
import Page from 'pages/page';

export default function App() {
  const dispatch = useDispatch();

  const user = useSelector(state => state.user);
  const site = useSelector(state => state.site);

  /** Check if there is a site configured */
  if (Object.entries(site).length === 0) {
    /** In case a single site is configured that should be the most of the cases then trigger the actions */
    if (sites.length === 1) {
      dispatch(setSite(sites[0]));
    }
    return <Alert variant="danger">Application is not configured. Site configuration is missing</Alert>;
  }
  if (!user.isAuthenticated) {
    return (
      <>
        <Menu />
        <LoginPage />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Menu />
      <Page>
        <ErrorBoundary>
          <Routes>
            <Route
              path="/sessions"
              element={
                <>
                  <SessionsPage />
                </>
              }
            />
            <Route path="/proposals" element={<ProposalsPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/prepare" element={<PreparePage />} />
          </Routes>
        </ErrorBoundary>
      </Page>
    </BrowserRouter>
  );
}
