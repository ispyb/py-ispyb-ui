import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import { Logout } from 'components/Header';
import { PersonBadge } from 'react-bootstrap-icons';
import { useAuth } from 'hooks/useAuth';
import { NavLink } from 'react-router-dom';

export function JavaHeader() {
  return (
    <>
      <Navbar.Toggle aria-controls="main-navbar" />
      <Navbar.Collapse id="main-navbar">
        <Nav className="me-auto">
          <Nav.Link as={NavLink} to="/legacy/sessions/list">
            My sessions
          </Nav.Link>
          <Nav.Link as={NavLink} to="/legacy/proposals/list">
            My proposals
          </Nav.Link>
        </Nav>

        <Nav>
          <PersonMenu />
          <Logout />
        </Nav>
      </Navbar.Collapse>
    </>
  );
}

function PersonMenu() {
  const { javaPerson } = useAuth();
  return (
    <NavDropdown
      title={
        <>
          <PersonBadge className="me-1" />
          {javaPerson?.username}
        </>
      }
      id="admin-nav-dropdown"
      align="end"
    >
      <NavDropdown.Header>{javaPerson?.roles}</NavDropdown.Header>
    </NavDropdown>
  );
}
export function JavaProposalMenu({ proposal }: { proposal: string }) {
  return (
    <>
      <Nav.Link as={NavLink} to={`/legacy/proposals/${proposal}/sessions`}>
        Sessions
      </Nav.Link>
      <Nav.Link as={NavLink} to={`/legacy/proposals/${proposal}/shipping`}>
        Shipments
      </Nav.Link>
      <Nav.Link as={NavLink} to={`/legacy/proposals/${proposal}/MX/prepare`}>
        Sample changer
      </Nav.Link>
    </>
  );
}
