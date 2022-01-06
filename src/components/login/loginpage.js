import React from 'react';
import { Col, Container, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import LoginTabs from './logintabs';
import { useSelector } from 'react-redux';
import ErrorBoundary from '../errors/errorboundary';

function LoginPage() {
  const user = useSelector((state) => state.user);
  if (user.token) {
    return null;
  }
  const loginTabs = <LoginTabs />;

  return (
    <ErrorBoundary>
      <Container fluid>
        {' '}
        <Row>
          <Col xs={12}>
            <h1 style={{ marginTop: 25 }}>Sign in</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="hidden-sm hidden-md hidden-lg" style={{ marginTop: 25, marginBottom: -20 }}>
            {loginTabs}
          </Col>
        </Row>
      </Container>
    </ErrorBoundary>
  );
}

export default LoginPage;

/*
<Container fluid>
      <Row>
        <Col xs={12}>
          <h1 style={{ marginTop: 25 }}>Sign in</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="hidden-sm hidden-md hidden-lg" style={{ marginTop: 25, marginBottom: -20 }}>
          {loginTabs}
        </Col>
        <Col xs={12} sm={7} lg={6}>
          <ListGroup style={{ fontSize: 16, marginTop: 38 }}>
            <ListGroupItem header="ESRF, CRG staff or long term visitors">Please sign in with ESRF SSO</ListGroupItem>
            <ListGroupItem header="I am new to the portal">
              <a href="https://smis.esrf.fr/misapps/SMISWebClient/accountManager/searchExistingAccount.do?action=search">Create a new account</a>
            </ListGroupItem>
            <li className="list-group-item">
              <h4 className="list-group-item-heading">
                <a href="mailto:dataportal-feedback@esrf.fr">I need further assistance</a>
              </h4>
            </li>
            <ListGroupItem variant="warning" header="Important note">
              During 2019 and according to the General Data Protection Regulation, all portal users who did not consent to the{' '}
              <a href="http://www.esrf.fr/GDPR" rel="noopener noreferrer" target="_blank">
                User Portal Privacy Statement
              </a>{' '}
              have had their account deactivated. Please contact the <a href="http://www.esrf.eu/UsersAndScience/UserGuide/Contacts">User Office</a> if you wish to reactivate it.
            </ListGroupItem>
          </ListGroup>
        </Col>
        <Col sm={5} lg={4} className="hidden-xs">
          {loginTabs}
        </Col>
      </Row>
    </Container>
    */
