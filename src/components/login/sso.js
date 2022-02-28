import React from 'react';
import UI from '../../config/ui';
import ErrorUserMessage from 'components/usermessages/errorusermessage';
import { keycloakLogin } from 'keycloak';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Button, Alert } from 'react-bootstrap';

function SSO() {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  function handleClick() {
    const fromLocation = location.state?.from;

    if (fromLocation) {
      const { pathname, search, hash } = fromLocation;
      const redirectPath = `${pathname}${search}${hash}`;
      const redirectUri = `${window.location.origin}/login${redirectPath === '/' ? '' : `?to=${encodeURIComponent(redirectPath)}`}`;

      keycloakLogin({ redirectUri });
    } else {
      keycloakLogin();
    }
  }

  //<Loader message="Authenticating..." inPanel />
  if (user.isAuthenticating) {
    return <div style={{ margin: '1.5rem' }}>"Authenticating"</div>;
  }

  return (
    <div style={{ padding: '30px 15px', textAlign: 'center' }}>
      {user.error && <ErrorUserMessage text={user.error} />}
      {user.isSessionExpired && <Alert bsStyle="warning">Session expired</Alert>}

      <Button type="submit" bsStyle="primary" bsSize="large" onClick={handleClick}>
        {UI.loginForm.ssoBtnLabel}
      </Button>
    </div>
  );
}

export default SSO;
