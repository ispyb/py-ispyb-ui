import { LOGGED_IN, LOGIN_ERROR, LOG_IN, LOG_OUT } from '../actiontypes';

interface User {
  username: string;
  roles: string;
  token: string;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isError: boolean;
  type: string;
  error: string;
  isSSO: boolean;
}

const initialState: User = {
  username: '',
  roles: '',
  token: '',
  isAuthenticated: false,
  isAuthenticating: false,
  isError: false,
  type: '',
  error: '',
  isSSO: true,
};

const user = (state = initialState, action: User) => {
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
        isError: false,
      };
      break;
    }
    case LOG_OUT: {
      state = {
        ...initialState,
        username: '',
        token: '',
        roles: '',
        isAuthenticated: false,
        isAuthenticating: false,
        isError: false,
      };
      break;
    }
    case LOGIN_ERROR: {
      state = { ...initialState, error: action.error, isAuthenticated: false, isAuthenticating: false, isError: true };
      break;
    }
    default:
      break;
  }
  return state;
};

export default user;
