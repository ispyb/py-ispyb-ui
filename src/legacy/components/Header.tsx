import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import { useProposal } from 'hooks/useProposal';
import { Logout } from 'components/Header';
import { PersonBadge } from 'react-bootstrap-icons';
import { useAuth } from 'hooks/useAuth';
import { NavLink, useLocation } from 'react-router-dom';

export function JavaHeader() {
  const { proposalName } = useProposal();
  const { pathname } = useLocation();

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
          {!proposalName && (
            <Nav.Link className="nav-link" eventKey="disabled" disabled>
              No Proposal
            </Nav.Link>
          )}
          {proposalName && (
            <NavDropdown
              active={pathname.includes(proposalName)}
              title={proposalName}
              id="proposal-nav-dropdown"
            >
              <NavDropdown.Item
                as={NavLink}
                to={`/legacy/proposals/${proposalName}/sessions`}
              >
                Sessions
              </NavDropdown.Item>
              <NavDropdown.Item
                as={NavLink}
                to={`/legacy/proposals/${proposalName}/shipping`}
              >
                Shipping
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Header>Prepare experiment</NavDropdown.Header>
              <NavDropdown.Item
                as={NavLink}
                to={`/legacy/proposals/${proposalName}/MX/prepare`}
              >
                {'> MX'}
              </NavDropdown.Item>
            </NavDropdown>
          )}
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
