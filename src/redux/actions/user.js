import {
  //LOGGED_IN, LOGIN_ERROR, LOG_IN,
  LOG_OUT,
} from '../actiontypes';

export function doLogOut(sessionId, params = { expired: false }) {
  return { type: LOG_OUT, ...params };
}

export function doSignIn(plugin, username, password, site = 'ESRF') {}

export function doSilentRefreshFromSSO() {}
