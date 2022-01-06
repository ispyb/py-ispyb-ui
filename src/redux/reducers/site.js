import { SET_SITE, LOG_OUT } from '../actiontypes';

const initialState = {};

const site = (state = initialState, action) => {
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
