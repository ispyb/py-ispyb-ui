import { Container, Navbar } from 'react-bootstrap';

import React from 'react';

/**
 * Menu class which is used to render the app main top menu
 */
function Footer() {
  return (
    <Navbar bg="light" variant="light" sticky="bottom">
      <Container>
        <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Mark Otto</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

//const MenuWithRouter = withRouter(Menu);
//export default MenuWithRouter;
export default Footer;
