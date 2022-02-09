import React from 'react';
import { useSelector } from 'react-redux';
import { Col, Container, Row, Card, Carousel, Button } from 'react-bootstrap';
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
            <Carousel fade variant="dark">
              <Carousel.Item style={{ textAlign: 'center' }}>
                <img className="w-75" src="/images/carousel/sessions_cosmo_reduced.png" alt="Second slide" />
                <Carousel.Caption>
                  <h3>Welcome to ISPyB</h3>
                  <p>This is the most recent interface to ISPyB. It's compatible with ISPyB and the newest py-ISPyB.</p>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item style={{ textAlign: 'center' }}>
                <img className="w-50" src="/images/carousel/statistics_reduced.jpeg" alt="Second slide" />

                <Carousel.Caption>
                  <h3>Monitor your experiment in real time</h3>
                  <p>Real time statistics helps with the decision-making during the experiment</p>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item style={{ textAlign: 'center', margin: '-50' }}>
                <img
                  className="w-50"
                  src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.g2crowd.com%2Fuploads%2Fproduct%2Fimage%2Fsocial_landscape%2Fsocial_landscape_048daf32d4748a4dcd8a38617af4ff85%2Fkeycloak.png&f=1&nofb=1"
                  alt="Second slide"
                />
                <br />
                <Carousel.Caption style={{ textAlign: 'center', margin: '-50' }}>
                  <br />
                  <h3>Multiple authentication plugins</h3>
                  <p>Authenticate users with openId or LDAP out of the box</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
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
