import React from 'react';
import SessionTable from 'pages/session/sessiontable';
import { Provider } from 'react-redux';
import { store } from 'store';
import { BrowserRouter } from 'react-router-dom';

const l = { title: 'SessionTable', component: SessionTable };
export default l;

const data = [
  {
    lastEndTimeDataCollectionGroup: null,
    beamLineOperator: 'Sherlock Holmes',
    testDataCollectionGroupCount: 1,
    BLSession_lastUpdate: 'Jan 18, 2022 7:59:59 AM',
    beamLineName: 'ID30A-1',
    Person_familyName: 'operator on ID30A-1',
    proposalId: 12,
    sampleCount: 2,
    dataCollectionGroupCount: 5,
    energyScanCount: 7,
    hplcCount: 2,
    calibrationCount: 20,
    xrfSpectrumCount: 0,
    Proposal_title: 'operator on ID30A-1',
    Proposal_proposalCode: 'OPID',
    Proposal_ProposalType: 'MX',
    lastExperimentDataCollectionGroup: null,
    bltimeStamp: 'Jan 17, 2022 3:34:20 PM',
    comments: 'Session created by the BCM',
    Proposal_ProposalNumber: '30a1',
    Person_personId: 11,
    EMdataCollectionGroupCount: 10,
    BLSession_protectedData: null,
    imagesCount: 3,
    sessionId: 74151,
    nbShifts: 3,
    sampleChangerCount: 12,
    BLSession_endDate: 'Jan 18, 2022 7:59:59 AM',
    BLSession_startDate: 'Jan 17, 2022 12:00:00 AM',
  },
];
const Story = (args) => (
  <Provider store={store}>
    <BrowserRouter>
      <SessionTable {...args} />
    </BrowserRouter>
  </Provider>
);

export const AllSessionTable = Story.bind({});
AllSessionTable.args = { data: data };

export const MXSessionTable = Story.bind({});
MXSessionTable.args = {
  ...AllSessionTable.args,
  areSAXSColumnsVisible: false,
  areEMColumnsVisible: false,
};

export const SAXSSessionTable = Story.bind({});
SAXSSessionTable.args = {
  ...AllSessionTable.args,
  areMXColumnsVisible: false,
  areEMColumnsVisible: false,
};

export const EMSessionTable = Story.bind({});
EMSessionTable.args = {
  ...AllSessionTable.args,
  areMXColumnsVisible: false,
  areSAXSColumnsVisible: false,
};
