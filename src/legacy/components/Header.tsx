import { Navbar, NavDropdown, Nav, NavItem } from 'react-bootstrap';
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
            All my sessions
          </Nav.Link>
          <Nav.Link as={NavLink} to="/legacy/proposals/list">
            All my proposals
          </Nav.Link>
        </Nav>

        <Nav>
          <PersonMenu />
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
      <NavDropdown.Header>
        <i>{javaPerson?.roles}</i>
      </NavDropdown.Header>
      <Logout />
    </NavDropdown>
  );
}

export function Logout() {
  const { clearToken } = useAuth();
  return (
    <NavDropdown.Item
      as={NavItem}
      onClick={() => {
        clearToken();
      }}
    >
      Logout
    </NavDropdown.Item>
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
