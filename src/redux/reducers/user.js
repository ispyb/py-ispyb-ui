import { LOGGED_IN, LOGIN_ERROR, LOG_IN, LOG_OUT } from '../actiontypes';

const initialState = {
  username: null,
  roles: null,
  token: null,
  isAuthenticated: false,
  isAuthenticating: false,
  isError: false
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN: {
      state = { ...initialState, username: action.username, isAuthenticated: false, isAuthenticating: true, isError: false };
      break;
    }
    case LOGGED_IN: {
      state = {
        ...initialState,
        username: action.username,
        token: action.token,
        roles: action.roles,
        isAuthenticated: true,
        isError: false
      };
      break;
    }
    case LOG_OUT: {
      state = {
        ...initialState,
        username: null,
        token: null,
        roles: null,
        isAuthenticated: false,
        isAuthenticating: false,
        isError: false
      };
      break;
    }
    case LOGIN_ERROR: {
      debugger;
      state = { ...initialState, error: action.error, isAuthenticated: false, isAuthenticating: false, isError: true };
      break;
    }
    default:
      break;
  }
  return state;
};

export default user;
