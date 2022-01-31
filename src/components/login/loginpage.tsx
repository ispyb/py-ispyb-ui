import React from 'react';
import { useSelector } from 'react-redux';
import { Col, Container, Row, Alert } from 'react-bootstrap';
import LoginTabs from 'components/login/logintabs';
import ErrorBoundary from 'components/errors/errorboundary';
import { RootState } from 'store';

function LoginPage() {
  const user = useSelector((state: RootState) => state.user);
  if (user.token) {
    return null;
  }
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
          <Col md={8}>
            <Alert key="alert-development" variant="warning">
              This application is currently under development
            </Alert>
          </Col>
          <Col xs={12} md={4}>
            <LoginTabs />
          </Col>
        </Row>
      </Container>
    </ErrorBoundary>
  );
}

export default LoginPage;
