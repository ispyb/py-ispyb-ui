import { LOGGED_IN, LOGIN_ERROR, LOG_IN, LOG_OUT } from '../actiontypes';

const initialState = {
  username: null,
  roles: null,
  token: null,
  isLoggedIn: false,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN: {
      state = {
        ...initialState,
        username: action.username,
        isSSO: action.username === null,
        isAuthenticating: true,
      };
      break;
    }
    case LOGGED_IN: {
      state = {
        ...initialState,
        username: state.username,
        token: action.token,
        roles: action.roles,
      };
      break;
    }
    case LOG_OUT: {
      state = { ...initialState, isSessionExpired: action.expired };
      break;
    }
    case LOGIN_ERROR: {
      state = { ...initialState, error: action.error };
      break;
    }
    default:
      break;
  }
  return state;
};

export default user;
