import { SET_SESSIONS_MX_COLUMNS } from '../actiontypes';

export function setVisibleSessionMxColumn(visible: boolean) {
  return {
    type: SET_SESSIONS_MX_COLUMNS,
    ui: { areMXSessionColumnsVisible: visible },
  };
}
