import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import Menu from 'components/menu/menu';
import LoginPage from 'components/login/loginpage';
import { setSite } from 'redux/actions/site';
import sites from 'config/sites';
import 'bootswatch/dist/pulse/bootstrap.min.css';

export default function App() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const site = useSelector((state) => state.site);

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
  debugger;
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="users/*" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

function Users() {
  return (
    <div>
      <nav>
        <Link to="me">My Profile</Link>
      </nav>

      <Routes>
        <Route path=":id" element={<div>Test</div>} />
        <Route path="me" element={<div>Test2</div>} />
      </Routes>
    </div>
  );
}
