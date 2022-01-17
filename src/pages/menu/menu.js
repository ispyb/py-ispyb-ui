import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { doLogOut } from 'redux/actions/user';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router';

function LogOut(props) {
  const { username } = props;
  const dispatch = useDispatch();
  return (
    <>
      <Button variant="outline-success" onClick={() => dispatch(doLogOut())}>
        <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 10 }}></FontAwesomeIcon>
        Log out {username}
      </Button>
    </>
  );
}

function NavBarMenu(props) {
  return (
    <Navbar bg="light" variant="light" fixed="top">
      <Container>{props.children}</Container>
    </Navbar>
  );
}

function EmptyMenu() {
  return (
    <NavBarMenu>
      <Navbar.Brand href="#home">ISPyB</Navbar.Brand>
      <Navbar.Toggle />
    </NavBarMenu>
  );
}

/**
 * Menu class which is used to render the app main top menu
 */
function Menu() {
  const user = useSelector((state) => state.user);
  const { username } = user;
  if (!user.isAuthenticated) {
    return <EmptyMenu />;
  }
  return (
    <NavBarMenu>
      <Navbar.Brand href="#home">ISPyB</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/sessions">Home</Nav.Link>
          <Nav.Link href="/proposals">Proposals</Nav.Link>
          <Nav.Link href="/sessions">Sessions</Nav.Link>
          <Nav.Link href="/shipping">Shippings</Nav.Link>
          <Nav.Link href="/prepare">Prepare Experiment</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link>
            <LogOut username={username} />
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </NavBarMenu>
  );
}

//const MenuWithRouter = withRouter(Menu);
//export default MenuWithRouter;
export default Menu;
