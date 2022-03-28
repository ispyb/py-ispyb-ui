import React, { PropsWithChildren } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { doLogOut } from 'redux/actions/user';
import { Container, Navbar, Nav, Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import { RootState } from 'store';
import { User } from 'models';
import { useParams } from 'react-router-dom';

function LogOut(props: { user: User }) {
  const { user } = props;
  const dispatch = useDispatch();
  return (
    <Button variant="outline-success" onClick={() => dispatch(doLogOut())}>
      <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 10 }}></FontAwesomeIcon>
      Log out {user.username}
    </Button>
  );
}

// function NavBarMenu(props: PropsWithChildren<unknown>) {
//   const user = useSelector((state: RootState) => state.user);
//   const { username } = user;
//   return (
//     <Navbar bg="light" variant="light" fixed="top">
//       <Container>
//         <Col>
//           <Row>
//             <Navbar.Brand href="#home">ISPyB</Navbar.Brand>
//             <Navbar.Toggle aria-controls="responsive-navbar-nav" />
//             <Navbar.Collapse id="responsive-navbar-nav">
//               {props.children}
//               <Nav>
//                 <Nav.Link>
//                   <LogOut username={username} />
//                 </Nav.Link>
//               </Nav>
//             </Navbar.Collapse>
//           </Row>
//         </Col>
//       </Container>
//     </Navbar>
//   );
// }

// function EmptyMenu() {
//   return (
//     <NavBarMenu>
//       <Navbar.Brand href="#home">ISPyB</Navbar.Brand>
//       <Navbar.Toggle />
//     </NavBarMenu>
//   );
// }

// /**
//  * Menu class which is used to render the app main top menu
//  */
// function Menu() {
//   const user = useSelector((state: RootState) => state.user);
//   const { username } = user;
//   if (!user.isAuthenticated) {
//     return <EmptyMenu />;
//   }
//   return (
//     <NavBarMenu>
//       <Nav className="me-auto">
//
//       </Nav>
//     </NavBarMenu>
//   );
// }

// //const MenuWithRouter = withRouter(Menu);
// //export default MenuWithRouter;
// export default Menu;

export default function Menu() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <Col style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: Number.MAX_SAFE_INTEGER }}>
      <Row>
        <MainMenu user={user}></MainMenu>
      </Row>
      <Row>
        <ProposalMenu user={user}></ProposalMenu>
      </Row>
    </Col>
  );
}

export function MainMenu({ user }: { user: User }) {
  return (
    <Navbar style={{ maxHeight: 60 }} bg="light" variant="light">
      <Container>
        <Navbar.Brand href="#home">ISPyB</Navbar.Brand>
        {user.isAuthenticated && (
          <Nav className="me-auto">
            {[
              { to: '/home', title: 'Home' },
              { to: '/proposals', title: 'My proposals' },
              { to: '/sessions', title: 'My sessions' },
            ].map((item) => {
              return (
                <Nav>
                  <LinkContainer to={item.to}>
                    <Nav.Link>{item.title}</Nav.Link>
                  </LinkContainer>
                </Nav>
              );
            })}
          </Nav>
        )}
        <Nav>
          <Nav.Link>
            <LogOut user={user} />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

type Param = {
  proposalName: string;
};
export function ProposalMenu({ user }: { user: User }) {
  if (!user.isAuthenticated) {
    return <></>;
  }
  const { proposalName } = useParams<Param>();
  if (!proposalName) {
    return <></>;
  }
  // return <ProposalOverlay></ProposalOverlay>;
  return (
    <Navbar style={{ maxHeight: 30, borderTop: '1px solid black' }} bg="light" variant="light">
      <Container>
        <Navbar.Brand>Proposal {proposalName}</Navbar.Brand>
        <Nav className="me-auto">
          <Nav className="me-auto">
            {[
              { to: `/${proposalName}/sessions`, title: 'Sessions' },
              { to: `/${proposalName}/MX/prepare`, title: 'Prepare experiment' },
            ].map((item) => {
              return (
                <Nav>
                  <LinkContainer to={item.to}>
                    <Nav.Link>{item.title}</Nav.Link>
                  </LinkContainer>
                </Nav>
              );
            })}
          </Nav>
        </Nav>
      </Container>
    </Navbar>
  );
}
