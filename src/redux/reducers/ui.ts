import { SET_SESSIONS_MX_COLUMNS } from '../actiontypes';
import techniques from 'config/techniques';
import UI from 'config/ui';

interface UserInterfaceType {
  areMXSessionColumnsVisible: boolean;
  areSAXSSessionColumnsVisible: boolean;
  areEMSessionColumnsVisible: boolean;
  type: string;
}

const initialState: UserInterfaceType = {
  areMXSessionColumnsVisible:
    techniques.MX.enabled && UI.options.sessionsPage.areMXColumnsVisible,
  areSAXSSessionColumnsVisible: techniques.SAXS.enabled,
  areEMSessionColumnsVisible: techniques.EM.enabled,
  type: '',
};

interface UserInterfaceActionType {
  type: string;
  ui: UserInterfaceType;
}

const ui = (state = initialState, action: UserInterfaceActionType) => {
  switch (action.type) {
    case SET_SESSIONS_MX_COLUMNS: {
      state = {
        ...initialState,
        areMXSessionColumnsVisible: action.ui.areMXSessionColumnsVisible,
      };
      break;
    }
    default:
      break;
  }
  return state;
};

export default ui;
