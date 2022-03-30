import React from 'react';
import { useSelector } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';
import LoginTabs from 'components/login/logintabs';
import { RootState } from 'store';
import Page from 'pages/page';
import WelcomeCarousel from 'components/login/welcomecarousel';
function LoginPage() {
  const user = useSelector((state: RootState) => state.user);
  if (user.token) {
    return null;
  }
  return (
    <Page selected="login">
      <Container fluid>
        <Row>
          <Col md={8}>
            <WelcomeCarousel></WelcomeCarousel>
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
