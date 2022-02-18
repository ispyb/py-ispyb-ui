import Keycloak from 'keycloak-js';
import sites from './config/sites';
//import differenceInMilliseconds from 'date-fns/difference_in_milliseconds';
import { store } from 'store';
import { doLogOut, doSignIn } from 'redux/actions/user';

const keycloak = sites[0].authentication.sso.enabled ? new Keycloak(sites[0].authentication.sso.configuration) : null;
if (keycloak) {
  keycloak.onTokenExpired = () => {
    // When SSO access token expires, try to refresh it
    // https://www.keycloak.org/docs/latest/securing_apps/#callback-events
    keycloak.updateToken().catch(() => {
      // If session has fully expired or an error occurred, clear expired token completely
      keycloak.clearToken(); // this invokes `onAuthLogout`
    });
  };
}

export default keycloak;

export function getRemainingSessionTime(expirationTime) {
  //return differenceInMilliseconds(expirationTime, new Date());
  return expirationTime.getTime() - new Date().getTime();
}

export function checkExpirationTime() {
  const { expirationTime } = store.getState().user;

  // If ICAT session is expired or expires in less than five minutes, log user out
  if (expirationTime && getRemainingSessionTime(expirationTime) < 5 * 60 * 1000) {
    store.dispatch(doLogOut({ expired: true }));
  }
}

export function matchAuthStateToSSO() {
  const { sessionId, isSSO } = store.getState().user;

  const { plugin } = store.getState().site.authentication.sso;

  console.log(store.getState().site.authentication);
  // If user is logged in to SSO but not to ICAT, log in to ICAT
  if (keycloak.authenticated && !sessionId) {
    store.dispatch(doSignIn(plugin, null, keycloak.token));
    return;
  }
  // If user is logged in to ICAT but logged out of SSO, log out of ICAT
  // (Only log out users who had previously logged in through SSO)
  if (!keycloak.authenticated && sessionId && isSSO) {
    store.dispatch(doLogOut());
  }
}
