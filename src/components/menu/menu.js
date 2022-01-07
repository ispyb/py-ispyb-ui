import { Container, Navbar } from 'react-bootstrap';

import React from 'react';

function Header() {
  return (
    <Navbar bg="light" variant="light" sticky="top">
      <Container>
        <Navbar.Brand href="#home">EXI2</Navbar.Brand>
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

/**
 * Menu class which is used to render the app main top menu
 */
function Menu(props) {
  const { user } = props;
  //const changeTheme = () => {
  /*const link = find(document.getElementsByTagName('link'), (o) => {
      return o.href.indexOf('bootstrap.min.css') !== -1;
    });
    if (link) {
      link.setAttribute(
        'href',
        `https://bootswatch.com/3/${theme}/bootstrap.min.css`
      );3000
    }*/
  //  alert('Not implemented yet');
  //};

  if (!user.isLoggedIn) {
    return <Header />;
  }
  /** If there is not sessionId it means that we are not already been authenticated **/

  return (
    <Navbar bg="light" variant="light" sticky="top">
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
export default Menu;
