import { SET_SITE, LOG_OUT } from 'redux/actiontypes';
import { Site } from 'models';

interface Action {
  site: Site;
  type: string;
}

const initialState: Site = {
  authentication: { sso: { enabled: false }, authenticators: [] },
  techniques: {},
  server: '',
  name: '',
};

const site = (state = initialState, action: Action) => {
  switch (action.type) {
    case SET_SITE: {
      state = action.site;
      break;
    }
    case LOG_OUT: {
      state = initialState;
      break;
    }
    default:
      break;
  }
  return state;
};

export default site;
