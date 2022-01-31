import { SET_SESSIONS_MX_COLUMNS, SET_SESSIONS_SAXS_COLUMNS, SET_SESSIONS_EM_COLUMNS } from '../actiontypes';
import UI from 'config/ui';

let initialState = UI;

const ui = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSIONS_MX_COLUMNS: {
      state = {
        ...initialState,
        sessionsPage: {
          ...state.sessionsPage,
          areMXColumnsVisible: action.visible,
        },
      };
      break;
    }
    case SET_SESSIONS_SAXS_COLUMNS: {
      state = {
        ...initialState,
        sessionsPage: {
          ...state.sessionsPage,
          areSAXSColumnsVisible: action.visible,
        },
      };
      break;
    }
    case SET_SESSIONS_EM_COLUMNS: {
      state = {
        ...initialState,
        sessionsPage: {
          ...state.sessionsPage,
          areEMColumnsVisible: action.visible,
        },
      };
      break;
    }
    default:
      break;
  }
  return state;
};

export default ui;
