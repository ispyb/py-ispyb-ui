import { LOGGED_IN, LOG_OUT, LOGIN_ERROR } from '../actiontypes';
import { getLogin } from 'api/ispyb';
import axios from 'axios';
import qs from 'qs';

export function doLogOut() {
  return { type: LOG_OUT };
}

/**
 * This method is used when authentication is based on ISPyB.
 *
 * @param {*} plugin This can be opitional depending on the specific implementation. It is not used when ISPyB is the backend
 * @param {*} username
 * @param {*} password
 * @param {*} site This can be optional depending on the specific inplementation. It is not used when py-ispyb is the backend
 */
export function doSignIn(plugin, username, password, site) {
  return function (dispatch) {
    axios
      .post(
        getLogin(site),
        qs.stringify({
          plugin: plugin,
          login: username,
          password: password,
          token: password,
        }),
        { 'content-type': 'application/json' }
      )
      .then((response) => {
        /** ISPYB  does not respond with an error code when authentication is failed this is why it is checked if token and roles and retrieved **/
        const { token, roles } = response.data;
        if (token && roles) {
          return dispatch({ type: LOGGED_IN, username, token, roles });
        }
        throw new Error('Authentication failed');
      })
      .catch((error) => {
        dispatch({ type: LOGIN_ERROR, error });
      });
  };
}
