import React from 'react';
import { Card, Tab, Tabs, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import LoginForm from 'components/login/loginform';

function LoginTabs() {
  const site = useSelector((state) => state.site);

  console.log(site.authentication);
  return (
    <Card>
      <Tabs id="login-tabs" transition={false} style={{ margin: '10px' }}>
        {site.authentication.sso.enabled !== 'false' && (
          <Tab eventKey="sso" title="SSO" border="0">
            SSo should be displayed here
          </Tab>
        )}
        {site.authentication?.authenticators
          .filter((a) => a.enabled)
          .map((authenticator) => (
            <Tab key={authenticator.plugin} eventKey={authenticator.plugin} title={authenticator.title} style={{ margin: '10px' }}>
              <Alert variant="info">
                {' '}
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 10 }} />
                Use ISPyB authentication when you log in as a proposal
              </Alert>
              <LoginForm site={authenticator.site} plugin={authenticator.plugin} />
            </Tab>
          ))}
      </Tabs>
    </Card>
  );
}

export default LoginTabs;
