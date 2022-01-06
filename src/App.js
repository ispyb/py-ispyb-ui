import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Menu from './components/menu/menu';
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from './components/login/loginpage';
import { setSite } from './redux/actions/site';
import sites from './config/sites';
import Footer from './components/footer/footer';

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
    return 'Application is not configured. Sites are missing';
  }
  if (!user.isLoggedIn) {
    return (
      <>
        <Menu user={user} />
        <LoginPage />
        <Footer></Footer>
      </>
    );
  }

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
