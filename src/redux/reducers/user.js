import { LOGGED_IN, LOGIN_ERROR, LOG_IN, LOG_OUT } from '../actiontypes';

const initialState = {
  username: null,
  roles: null,
  token: null,
  isAuthenticated: false,
  isAuthenticating: false,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN: {
      state = { ...initialState, username: action.username, isAuthenticated: true, logged: false };
      break;
    }
    case LOGGED_IN: {
      state = {
        ...initialState,
        username: action.username,
        token: action.token,
        roles: action.roles,
        isAuthenticated: false,
        logged: true,
      };
      break;
    }
    case LOG_OUT: {
      break;
    }
    case LOGIN_ERROR: {
      state = { ...initialState, error: action.error, isAuthenticated: false, isAuthenticating: false };
      break;
    }
    default:
      break;
  }
  return state;
};

export default user;
