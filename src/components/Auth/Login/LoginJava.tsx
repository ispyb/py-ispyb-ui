import { useRef, useState, useEffect, useCallback, FormEvent } from 'react';
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Alert,
  Spinner,
} from 'react-bootstrap';
import qs from 'qs';

import { useAuth } from 'hooks/useAuth';
import axios from 'axios';
import { getLogin } from 'legacy/api/ispyb';

export default function LoginJava() {
  const [error, setError] = useState<string>('');
  const [pending, setPending] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const { setToken, setJavaPerson, site } = useAuth();

  const userRef = useRef<any>();
  const passRef = useRef<any>();

  useEffect(() => {
    userRef.current?.focus();
  }, [userRef]);

  const resetPending = useCallback(() => {
    setTimeout(() => {
      setPending(false);
    }, 500);
  }, [setPending]);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      setPending(true);
      e.preventDefault();
      const form = e.currentTarget;
      if (!form.checkValidity()) {
        e.stopPropagation();
        return;
      }

      setValidated(true);

      setError('');
      axios
        .post(
          `${site.host}${site.apiPrefix}${getLogin(site)}`,
          qs.stringify({
            login: userRef.current?.value,
            password: passRef.current?.value,
          })
          // config:{ 'content-type': 'application/json' }
        )
        .then((response) => {
          /** ISPYB  does not respond with an error code when authentication is failed this is why it is checked if token and roles and retrieved **/
          const { token, roles } = response.data;
          if (token && roles) {
            resetPending();
            setToken(token);
            setJavaPerson({ roles, username: userRef.current?.value });
          } else {
            resetPending();
            setError('Authentication failed');
          }
        })
        .catch((err) => {
          resetPending();
          if (err.response) {
            err.response.json().then((json: any) => {
              setError(json.detail);
              console.log('error', err, json);
            });
          } else {
            setError(`Network Error: ${err.message}`);
          }
        });
    },
    [setToken, setJavaPerson, resetPending, site]
  );

  return (
    <Container>
      <Row>
        <Col xs={12} md={4}></Col>
        <Col xs={12} md={4}>
          <Form onSubmit={onSubmit} validated={validated}>
            {error && (
              <Row>
                <Col>
                  <Alert variant="danger">{error}</Alert>
                </Col>
              </Row>
            )}
            <Form.Group as={Row} className="mb-2">
              <Form.Label column>Username JAVA</Form.Label>
              <Col md={12} lg={8}>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  ref={userRef}
                  disabled={pending}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-2">
              <Form.Label column>Password</Form.Label>
              <Col md={12} lg={8}>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  ref={passRef}
                  disabled={pending}
                  required
                />
              </Col>
            </Form.Group>

            <div className="d-grid gap-2 mt-2">
              <Button variant="primary" type="submit" disabled={pending}>
                {!pending && <>Login</>}
                {pending && (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                )}
              </Button>
            </div>
          </Form>
        </Col>
        <Col xs={12} md={4}></Col>
      </Row>
    </Container>
  );
}
