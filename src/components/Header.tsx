import { Suspense } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useController } from 'rest-hooks';
import { Navbar, NavDropdown, Container, Nav, Button } from 'react-bootstrap';
import { PersonBadge } from 'react-bootstrap-icons';
import { useAuth } from 'hooks/useAuth';
import { useCurrentUser } from 'hooks/useCurrentUser';
import AuthErrorBoundary from './AuthErrorBoundary';
import { JavaHeader } from 'legacy/components/Header';
import LoadingProgress from './LoadingProgress';
import Breadcrumbs from './Breadcrumbs';
import { ActiveProposal } from './ActiveProposal';
import { Footer } from './Footer';
import Loading from './Loading';

function PersonMenu() {
  const currentUser = useCurrentUser();
  return (
    <NavDropdown
      title={
        <>
          <PersonBadge className="me-1" />
          {currentUser.login}
        </>
      }
      id="admin-nav-dropdown"
      align="end"
    >
      <NavDropdown.Header>
        {currentUser.givenName} {currentUser.familyName}
      </NavDropdown.Header>
      <AdminMenu />
      <BeamlineMenu />
    </NavDropdown>
  );
}

export function Logout() {
  const { clearToken } = useAuth();
  const { resetEntireStore } = useController();
  return (
    <Button
      onClick={() => {
        clearToken();
        resetEntireStore();
      }}
    >
      Logout
    </Button>
  );
}

function AdminMenu() {
  const currentUser = useCurrentUser();
  const adminPermissions = ['manage_options', 'manage_groups'];
  const userAdminPermissions = adminPermissions.filter((adminPermission) =>
    currentUser.Permissions.includes(adminPermission)
  );
  return (
    <>
      {userAdminPermissions.length > 0 && (
        <>
          <NavDropdown.Divider />
          <NavDropdown.Header>Administration</NavDropdown.Header>
          {currentUser.Permissions.includes('manage_options') && (
            <NavDropdown.Item as={Link} to={`/admin/options`}>
              Manage Options
            </NavDropdown.Item>
          )}
        </>
      )}
    </>
  );
}

function BeamlineMenu() {
  const currentUser = useCurrentUser();
  return (
    <>
      {currentUser.beamLines.length > 0 && (
        <>
          <NavDropdown.Divider />
          <NavDropdown.Header>My Beamlines</NavDropdown.Header>
          {currentUser.beamLines.map((beamLine) => (
            <NavDropdown.Item
              key={beamLine}
              as={Link}
              to={`/beamline/${beamLine}`}
            >
              {beamLine}
            </NavDropdown.Item>
          ))}
        </>
      )}
    </>
  );
}

export default function Header() {
  const { isAuthenticated, site } = useAuth();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar
        bg="primary"
        variant="dark"
        expand="md"
        className="main-header p-2"
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
            Home
          </Navbar.Brand>
          {isAuthenticated && !site.javaMode && <PyHeader />}
          {isAuthenticated && site.javaMode && <JavaHeader />}
        </Container>
      </Navbar>
      <ActiveProposal />
      <Breadcrumbs />
      <LoadingProgress />
      <div
        style={{
          overflow: 'auto',
          height: 'auto',
        }}
      >
        <Container
          fluid
          className="main"
          style={{
            marginTop: '1rem',
          }}
        >
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
          <Footer />
        </Container>
      </div>
    </div>
  );
}

function PyHeader() {
  return (
    <>
      <Navbar.Toggle aria-controls="main-navbar" />
      <Navbar.Collapse id="main-navbar">
        <Nav className="me-auto">
          <Nav.Link as={NavLink} to="/calendar">
            Calendar
          </Nav.Link>
          <Nav.Link as={NavLink} to="/proposals/list">
            Proposals
          </Nav.Link>
        </Nav>

        <Nav>
          <AuthErrorBoundary>
            <Suspense fallback={<span>...</span>}>
              <PersonMenu />
            </Suspense>
          </AuthErrorBoundary>
          <Logout />
        </Nav>
      </Navbar.Collapse>
    </>
  );
}

export function ProposalMenu({ proposal }: { proposal: string }) {
  return (
    <>
      <Nav.Link as={NavLink} to={`/proposals/${proposal}/sessions`}>
        Sessions
      </Nav.Link>
      <Nav.Link as={NavLink} to={`/proposals/${proposal}/calendar`}>
        Calendar
      </Nav.Link>
      <Nav.Link as={NavLink} to={`/proposals/${proposal}/contacts`}>
        Contacts
      </Nav.Link>
      <Nav.Link as={NavLink} to={`/proposals/${proposal}/shipments`}>
        Shipments
      </Nav.Link>
      <Nav.Link as={NavLink} to={`/proposals/${proposal}/proteins`}>
        Proteins
      </Nav.Link>
      <Nav.Link as={NavLink} to={`/proposals/${proposal}/samples`}>
        Samples
      </Nav.Link>
    </>
  );
}
