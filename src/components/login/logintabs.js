import React from 'react';
import { Card, Tab, Tabs } from 'react-bootstrap';
//import SSO from "./SSO";
import LoginForm from './loginform';
import { useSelector } from 'react-redux';

function LoginTabs() {
  const site = useSelector((state) => state.site);
  const user = useSelector((state) => state.user);

  return (
    <Tabs id="login-tabs" transition={false}>
      {site.authentication.sso.enabled !== 'false' && (
        <Tab eventKey="sso" title="SSO">
          <Card body>SSo should be displayed here</Card>
        </Tab>
      )}
      {site.authentication.authenticators
        .filter((a) => a.enabled)
        .map((authenticator) => (
          <Tab key={authenticator.plugin} eventKey={authenticator.plugin} title={authenticator.title}>
            <LoginForm plugin={authenticator.plugin} />
          </Tab>
        ))}
    </Tabs>
  );
}

export default LoginTabs;
