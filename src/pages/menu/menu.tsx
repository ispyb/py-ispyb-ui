import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { doLogOut } from 'redux/actions/user';
import { Container, Navbar, Nav, Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import { RootState } from 'store';
import { User } from 'models';
import { useParams } from 'react-router-dom';

import './menu.scss';

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

export default function Menu({ selected }: { selected?: string }) {
  const user = useSelector((state: RootState) => state.user);
  return (
    <Col style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: Number.MAX_SAFE_INTEGER }}>
      <Row>
        <MainMenu selected={selected} user={user}></MainMenu>
      </Row>
      <Row>
        <ProposalMenu selected={selected} user={user}></ProposalMenu>
      </Row>
    </Col>
  );
}

export function MainMenu({ user, selected }: { user: User; selected?: string }) {
  return (
    <Navbar className="mainNav" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">ISPyB</Navbar.Brand>
        {user.isAuthenticated && (
          <>
            <Nav className="me-auto">
              {[
                { to: '/proposals', title: 'My proposals', key: 'myproposals' },
                { to: '/sessions', title: 'My sessions', key: 'mysessions' },
              ].map((item) => {
                return (
                  <Nav>
                    <LinkContainer to={item.to}>
                      <Nav.Link className={item.key === selected ? 'selectedNav' : 'toto'}>{item.title}</Nav.Link>
                    </LinkContainer>
                  </Nav>
                );
              })}
            </Nav>
            <Nav>
              <Nav.Link>
                <LogOut user={user} />
              </Nav.Link>
            </Nav>
          </>
        )}
      </Container>
    </Navbar>
  );
}

type Param = {
  proposalName: string;
};
export function ProposalMenu({ user, selected }: { user: User; selected?: string }) {
  if (!user.isAuthenticated) {
    return <></>;
  }
  const { proposalName } = useParams<Param>();
  if (!proposalName) {
    return <></>;
  }
  return (
    <Navbar className="proposalNav" bg="light" variant="light">
      <Container>
        <Navbar.Brand>Proposal {proposalName}</Navbar.Brand>
        <Nav className="me-auto">
          <Nav className="me-auto">
            {[
              { to: `/${proposalName}/sessions`, title: 'Sessions', selected: 'sessions' },
              { to: `/${proposalName}/MX/prepare`, title: 'Prepare experiment', selected: 'prepare' },
            ].map((item) => {
              return (
                <Nav>
                  <LinkContainer to={item.to}>
                    <Nav.Link className={item.selected == selected ? 'selectedNav' : ''}>{item.title}</Nav.Link>
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
