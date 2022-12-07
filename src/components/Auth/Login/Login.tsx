import { Row, Col, Container, Button } from 'react-bootstrap';

import { useAuth } from 'hooks/useAuth';
import { SITES } from 'config/sites';
import LoginJava from './LoginJava';
import LoginPy from './LoginPy';

export default function Login() {
  const { site, setSite, siteInitialized } = useAuth();

  return (
    <Container>
      {siteInitialized && (
        <>
          {SITES.length > 1 && (
            <Col>
              <Row>
                <Col xs={12} md={4}></Col>
                <Col xs={12} md={4}>
                  <h5>Please select your site</h5>
                  <Row>
                    {SITES.map((siteBtn, index) => {
                      return (
                        <Col key={index}>
                          <Button
                            variant={
                              site === siteBtn ? 'primary' : 'outline-primary'
                            }
                            onClick={() => setSite(siteBtn)}
                            className="mb-3 w-100 lh-1"
                          >
                            {siteBtn.name}
                            <br />
                            <small className="fs-12 fw-light fst-italic">
                              {siteBtn.description}
                            </small>
                          </Button>
                        </Col>
                      );
                    })}
                  </Row>
                  <hr className="mb-4" />
                </Col>
              </Row>
              <Row></Row>
            </Col>
          )}
          <Row>
            {site.javaMode ? <LoginJava></LoginJava> : <LoginPy></LoginPy>}
          </Row>
        </>
      )}
    </Container>
  );
}
