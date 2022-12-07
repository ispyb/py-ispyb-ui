import { useRef, useState, useCallback, useEffect, FormEvent } from 'react';
import { useController, useSuspense } from 'rest-hooks';
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Alert,
  Spinner,
} from 'react-bootstrap';

import { LoginResource } from 'api/resources/Login';
import { useAuth } from 'hooks/useAuth';
import { AuthConfigResource } from 'api/resources/AuthConfig';
import { PluginConfig } from 'models/AuthConfig';
import Keycloak from 'keycloak-js';

export default function LoginPy() {
  const authConfig = useSuspense(AuthConfigResource.detail(), {});

  const [error, setError] = useState<string>('');
  const [pending, setPending] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const { setToken } = useAuth();
  const { fetch } = useController();
  const userRef = useRef<any>();
  const passRef = useRef<any>();
  const typeRef = useRef<any>();

  useEffect(() => {
    userRef.current?.focus();
  }, [userRef]);

  const resetPending = useCallback(() => {
    setTimeout(() => {
      setPending(false);
    }, 500);
  }, [setPending]);

  const ssoPlugin =
    authConfig.plugins.filter((p) => p.name === 'keycloak').length >= 1
      ? authConfig.plugins.filter((p) => p.name === 'keycloak')[0]
      : undefined;
  const passwordPlugins = authConfig.plugins.filter(
    (p) => p.name !== 'keycloak'
  );

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
      fetch(
        LoginResource.create(),
        {},
        {
          plugin:
            passwordPlugins.length === 1
              ? passwordPlugins[0].name
              : typeRef.current?.value,
          login: userRef.current?.value,
          password: passRef.current?.value,
        }
      )
        .then((response) => {
          resetPending();
          setToken(response.token);
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
    [setToken, fetch, resetPending, passwordPlugins]
  );

  const ssoForm = ssoPlugin ? (
    <Row>
      <Col xs={12} md={4}></Col>
      <Col xs={12} md={4}>
        <SSOLoginPy plugin={ssoPlugin} />
      </Col>
    </Row>
  ) : null;

  const passwordForm = passwordPlugins.length ? (
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
            <Form.Label column>Username</Form.Label>
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
          {passwordPlugins.length > 1 && (
            <Form.Group as={Row}>
              <Form.Label column>Type</Form.Label>
              <Col md={12} lg={8}>
                <Form.Control
                  as="select"
                  ref={typeRef}
                  disabled={pending}
                  required
                >
                  {passwordPlugins.map((plugin) => (
                    <option value={plugin.name}>{plugin.name}</option>
                  ))}
                </Form.Control>
              </Col>
            </Form.Group>
          )}
          <div className="d-grid gap-2 mt-4">
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
  ) : null;

  return (
    <Container>
      {ssoForm && passwordForm ? (
        <>
          {ssoForm}
          <Row>
            <Col xs={12} md={4}></Col>
            <Col xs={12} md={4}>
              <Row className="mb-2">
                <Col>
                  <hr />
                </Col>
                <Col sm={'auto'}>OR</Col>
                <Col>
                  <hr />
                </Col>
              </Row>
            </Col>
          </Row>
          {passwordForm}
        </>
      ) : (
        <>{ssoForm ? ssoForm : passwordForm}</>
      )}
    </Container>
  );
}

export function SSOLoginPy({ plugin }: { plugin: PluginConfig }) {
  const { setToken } = useAuth();
  const { fetch } = useController();

  const config: { [key: string]: string } = plugin.config as any;
  const keycloak = new Keycloak({
    url: config['KEYCLOAK_SERVER_URL'],
    realm: config['KEYCLOAK_REALM_NAME'],
    clientId: config['KEYCLOAK_CLIENT_ID'],
  });

  keycloak.init({});

  keycloak.onAuthSuccess = () => {
    fetch(
      LoginResource.create(),
      {},
      {
        plugin: plugin.name,
        token: keycloak.token,
      }
    ).then((response) => {
      setToken(response.token);
    });
    keycloak.onAuthSuccess = undefined;
    keycloak.onAuthError = undefined;
  };

  return (
    <>
      <Button
        onClick={() => {
          keycloak.login();
        }}
        className="mb-3 w-100 "
        variant={'secondary'}
      >
        Login with SSO
      </Button>
    </>
  );
}
