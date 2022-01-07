import { LOGGED_IN, LOG_IN, LOG_OUT, LOGIN_ERROR } from '../actiontypes';
import { getLogin } from 'api/ispyb';
// It should be replaced by a axios called, however for a reason I still don't understand, I got a CORS error when using actions due to the OPTIONS preflight call
import $ from 'jquery';

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
  return function(dispatch) {
    $.ajax({
      url: getLogin(site),
      data: {
        login: username,
        password: password
      },
      type: 'post',
      dataType: 'json',
      beforeSend: function() {
        dispatch({ type: LOG_IN, username: username, site: site });
      },
      success: function(data) {
        const { token, roles } = data;
        if (token && roles) {
          dispatch({ type: LOGGED_IN, username, token, roles });
        }
      },
      error: function(error) {
        dispatch({ type: LOGIN_ERROR, error });
      }
    });
  };
}

export function doSilentRefreshFromSSO() {}
