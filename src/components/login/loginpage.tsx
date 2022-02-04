import React from 'react';
import { useSelector } from 'react-redux';
import { Col, Container, Row, Alert } from 'react-bootstrap';
import LoginTabs from 'components/login/logintabs';
import { RootState } from 'store';
import Page from 'pages/page';

function LoginPage() {
  const user = useSelector((state: RootState) => state.user);
  if (user.token) {
    return null;
  }
  return (
    <Page>
      <Container fluid>
        <Row>
          <Col md={8}>
            <Alert key="alert-development" variant="warning">
              <h2> This application is currently under development</h2>
            </Alert>
          </Col>
          <Col xs={12} md={4}>
            <LoginTabs />
          </Col>
        </Row>
      </Container>
    </Page>
  );
}

export default LoginPage;
