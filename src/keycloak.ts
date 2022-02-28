import Keycloak from 'keycloak-js';
import { store } from 'store';
import { doLogOut, doSignIn } from 'redux/actions/user';
import { Site } from 'models';

let keycloak: Keycloak.KeycloakInstance | undefined = undefined;
let site: Site | undefined = undefined;

store.subscribe(() => {
  const site_i = store.getState().site;
  if (site == site_i) {
    return;
  }
  // if site change, update keycloak config accordingly
  site = site_i;
  if (site_i.authentication.sso.enabled && site_i.authentication.sso.configuration) {
    const keycloak_i = Keycloak(site_i.authentication.sso.configuration);
    keycloak_i.init({});
    keycloak_i.onAuthSuccess = () => {
      if (store.getState().user.isAuthenticated) {
        return; // already authenticated
      }
      const token = keycloak?.token;
      if (token) {
        const { plugin } = site_i.authentication.sso;
        store.dispatch(doSignIn(plugin, null, token, site_i.name));
      }
      keycloak_i.onAuthSuccess = undefined;
    };
    keycloak_i.onAuthError = (error) => {
      console.error(error);
    };
    keycloak_i.onAuthLogout = () => {
      if (store.getState().user.isSSO) {
        store.dispatch(doLogOut());
      }
    };
    keycloak_i.onTokenExpired = () => {
      keycloak?.updateToken(10 * 60).catch(() => {
        keycloak?.clearToken();
      });
    };
    keycloak = keycloak_i;
  } else {
    keycloak = undefined;
  }
});

export function keycloakLogin(options?: Keycloak.KeycloakLoginOptions) {
  keycloak?.login(options);
}
