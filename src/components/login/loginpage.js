import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
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
