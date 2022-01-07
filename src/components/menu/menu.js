import { Container, Navbar } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import React from 'react';

function Header() {
  return (
    <Navbar bg="light" variant="light" sticky="top">
      <Container>
        <Navbar.Brand href="#home">ISPyB</Navbar.Brand>
        <Navbar.Toggle />
      </Container>
    </Navbar>
  );
}

/**
 * Menu class which is used to render the app main top menu
 */
function Menu() {
  const user = useSelector((state) => state.user);
  const { username } = user;
  if (!user.logged) {
    return <Header />;
  }
  return (
    <Navbar bg="light" variant="light" sticky="top">
      <Container>
        <Navbar.Brand href="#home">My Proposals</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">{username}</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

//const MenuWithRouter = withRouter(Menu);
//export default MenuWithRouter;
export default Menu;
