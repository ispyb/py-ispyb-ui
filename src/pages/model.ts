export interface Proposal {
  Proposal_personId: number;
  Proposal_proposalCode: string;
  Proposal_proposalId: number;
  Proposal_proposalNumber: string;
  Proposal_proposalType: string;
  Proposal_title: string;
}

export interface Session {
  BLSession_endDate: string;
  BLSession_lastUpdate: string;
  BLSession_protectedData?: string;
  BLSession_startDate: string;
  EMdataCollectionGroupCount: number;
  Person_emailAddress?: string;
  Person_familyName: string;
  Person_givenName?: string;
  Person_personId: number;
  Proposal_ProposalNumber: string;
  Proposal_ProposalType: string;
  Proposal_proposalCode: string;
  Proposal_title: string;
  beamLineName: string;
  beamLineOperator?: string;
  beamLineSetupId?: string;
  bltimeStamp: string;
  calibrationCount: number;
  comments: string;
  dataCollectionGroupCount: number;
  databackupEurope?: string;
  databackupFrance?: string;
  dewarTransport?: string;
  energyScanCount: number;
  expSessionPk?: string;
  hplcCount: number;
  imagesCount?: string;
  lastEndTimeDataCollectionGroup?: string;
  lastExperimentDataCollectionGroup?: string;
  nbShifts: number;
  operatorSiteNumber?: string;
  projectCode?: string;
  proposalId: number;
  sampleChangerCount: number;
  sampleCount: number;
  scheduled: boolean;
  sessionId: number;
  sessionTitle?: string;
  structureDeterminations?: string;
  testDataCollectionGroupCount: number;
  usedFlag?: string;
  visit_number?: string;
  xrfSpectrumCount: number;
}
