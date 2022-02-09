import React from 'react';
import { useSelector } from 'react-redux';
import { Col, Container, Row, Alert, Carousel } from 'react-bootstrap';
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
              <Carousel.Item>
                <img className="d-block w-100" src="https://exi.esrf.fr/images/transparent_logo_exi.png" alt="First slide" />
                <Carousel.Caption>
                  <h3>First slide label</h3>
                  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img className="d-block w-100" src="https://react-bootstrap.github.io/components/carousel/holder.js/800x400?text=Second slide&bg=282c34" alt="Second slide" />

                <Carousel.Caption>
                  <h3>Second slide label</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img className="d-block w-100" src="https://react-bootstrap.github.io/components/carousel/holder.js/800x400?text=Third slide&bg=20232a" alt="Third slide" />

                <Carousel.Caption>
                  <h3>Third slide label</h3>
                  <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
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
