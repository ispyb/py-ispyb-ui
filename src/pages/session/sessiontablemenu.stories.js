import React from 'react';
import SessionTableMenu from 'pages/session/sessiontablemenu';
import { Provider } from 'react-redux';
import { store } from 'store';
import { setTechniqueVisibleSessionTable } from 'redux/actions/ui';
import { SET_SESSIONS_MX_COLUMNS, SET_SESSIONS_SAXS_COLUMNS, SET_SESSIONS_EM_COLUMNS } from 'redux/actiontypes';
import { BrowserRouter } from 'react-router-dom';

const l = { title: 'SessionTableMenu', component: SessionTableMenu };
export default l;

const Story = (args) => (
  <Provider store={store}>
    <BrowserRouter>
      <SessionTableMenu {...args} />
    </BrowserRouter>
  </Provider>
);

export const SimpleSessionTableMenu = Story.bind({});
SimpleSessionTableMenu.args = {
  checkList: [
    { text: 'MX', checked: true, action: setTechniqueVisibleSessionTable, actionType: SET_SESSIONS_MX_COLUMNS },
    { text: 'SAXS', checked: true, action: setTechniqueVisibleSessionTable, actionType: SET_SESSIONS_SAXS_COLUMNS },
    { text: 'EM', checked: true, action: setTechniqueVisibleSessionTable, actionType: SET_SESSIONS_EM_COLUMNS },
  ],
};

export const DatePickerSessionTableMenu = Story.bind({});
DatePickerSessionTableMenu.args = {
  showDatePicker: true,
  checkList: [
    { text: 'MX', checked: true, action: setTechniqueVisibleSessionTable, actionType: SET_SESSIONS_MX_COLUMNS },
    { text: 'SAXS', checked: true, action: setTechniqueVisibleSessionTable, actionType: SET_SESSIONS_SAXS_COLUMNS },
    { text: 'EM', checked: true, action: setTechniqueVisibleSessionTable, actionType: SET_SESSIONS_EM_COLUMNS },
  ],
};
