export interface Proposal {
  Proposal_personId: number;
  Proposal_proposalCode: string;
  Proposal_proposalId: number;
  Proposal_proposalNumber: string;
  Proposal_proposalType: string;
  Proposal_title: string;
}

export interface ProposalDetail {
  buffer: Buffer[];
  crystals: Crystal[];
  labcontacts: unknown[];
  ligands: Ligand[];
  macromolecules: unknown[];
  plateTypes: unknown[];
  proposal: {
    code: string;
    externalId: string;
    number: string;
    proposalId: number;
    timeStamp: string;
    title: string;
    type: string;
  }[];
  proteins: Protein[];
  stockSolutions: unknown[];
}

export interface ProposalSample {
  BLSample_SMILES?: string;
  BLSample_blSampleId?: number;
  BLSample_blSampleStatus?: string;
  BLSample_code?: string;
  BLSample_comments?: string;
  BLSample_completionStage?: string;
  BLSample_containerId?: number;
  BLSample_crystalId?: number;
  BLSample_diffractionPlanId?: number;
  BLSample_holderLength?: number;
  BLSample_isInSampleChanger?: string;
  BLSample_lastKnownCenteringPosition?: string;
  BLSample_location?: string;
  BLSample_loopLength?: string;
  BLSample_loopType?: string;
  BLSample_name: string;
  BLSample_publicationComments?: string;
  BLSample_publicationStage?: string;
  BLSample_recordTimeStamp?: string;
  BLSample_structureStage?: string;
  BLSample_wireWidth?: string;
  BLSession_beamLineName?: string;
  BLSession_startDate?: string;
  Container_beamlineLocation?: string;
  Container_code?: string;
  Container_containerId: number;
  Container_containerStatus?: string;
  Container_containerType?: string;
  Container_sampleChangerLocation?: string;
  DataCollectionGroup_dataCollectionGroupId?: string;
  Dewar_barCode?: string;
  Dewar_code?: string;
  Dewar_dewarId?: number;
  Dewar_dewarStatus?: string;
  Dewar_storageLocation?: string;
  Person_emailAddress?: string;
  Person_familyName?: string;
  Person_givenName?: string;
  Person_personId?: string;
  Protein_acronym: string;
  Protein_name?: string;
  Protein_proposalId?: number;
  Protein_proteinId?: number;
  Protein_proteinType?: string;
  Shipping_shippingId?: number;
  sessionId?: string;
}

export interface Ligand {
  blSampleId: number;
  creationDate: string;
  crystalId: number;
  filePath: string;
  fromResiduesBases: string;
  groupName: string;
  macromoleculeId: number;
  multiplicity: number;
  name: string;
  proposalId: number;
  sequence: string;
  structureId: number;
  structureType: string;
  symmetry: string;
  toResiduesBases: string;
  uniprotId: number;
}
export interface Buffer {
  acronym: string;
  bufferId: number;
  bufferhasadditive3VOs: unknown[];
  comments: string;
  composition: string;
  electronDensity: number;
  name: string;
  ph: number;
  proposalId: number;
  safetyLevelId: null;
}

export interface Crystal {
  cellA?: number;
  cellAlpha?: number;
  cellB?: number;
  cellBeta?: number;
  cellC?: number;
  cellGamma?: number;
  color?: string;
  comments?: string;
  crystalId?: number;
  diffractionPlanVO?: DiffractionPlan;
  morphology?: string;
  name?: string;
  pdbFileName?: string;
  pdbFilePath?: string;
  proteinVO: Protein;
  sizeX?: number;
  sizeY?: number;
  sizeZ?: number;
  spaceGroup?: string;
  structure3VOs?: unknown;
}

export interface DiffractionPlan {
  aimedCompleteness?: number;
  aimedIOverSigmaAtHighestRes?: number;
  aimedMultiplicity?: number;
  aimedResolution?: number;
  anomalousData?: boolean;
  anomalousScatterer?: string;
  axisRange?: number;
  comments?: string;
  complexity?: string;
  diffractionPlanId?: number;
  estimateRadiationDamage?: number;
  experimentKind?: string;
  exposureTime?: number;
  forcedSpaceGroup?: string;
  kappaStrategyOption?: string;
  maxDimAccrossSpindleAxis?: number;
  maximalResolution?: number;
  minDimAccrossSpindleAxis?: number;
  minOscWidth?: number;
  minimalResolution?: number;
  numberOfPositions?: number;
  observedResolution?: number;
  oscillationRange?: number;
  preferredBeamDiameter?: number;
  preferredBeamSizeX?: number;
  preferredBeamSizeY?: number;
  radiationSensitivity?: number;
  radiationSensitivityBeta?: number;
  radiationSensitivityGamma?: number;
  requiredCompleteness?: number;
  requiredMultiplicity?: number;
  requiredResolution?: number;
  screeningResolution?: number;
  strategyOption?: string;
}

export interface Protein {
  acronym: string;
  externalId: number;
  isCreatedBySampleSheet: number;
  molecularMass: number;
  name: string;
  personId: number;
  proteinId: number;
  proteinType: string;
  safetyLevel: string;
  sequence: string;
  timeStamp: string;
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

export interface ContainerDewar {
  Shipping_comments: string;
  barCode: string;
  beamLineOperator?: string;
  beamlineLocation?: string;
  beamlineName?: string;
  bltimeStamp: string;
  capacity: number;
  comments: string;
  containerCode: string;
  containerId: number;
  containerStatus?: string;
  containerType: string;
  creationDate: string;
  customsValue?: string;
  dateOfShippingToUser?: string;
  deliveryAgent_agentCode?: string;
  deliveryAgent_agentName?: string;
  deliveryAgent_deliveryDate?: string;
  deliveryAgent_flightCode?: string;
  deliveryAgent_shippingDate?: string;
  dewarCode: string;
  dewarId: number;
  dewarStatus?: string;
  firstExperimentId?: string;
  isReimbursed: false;
  isStorageDewar?: string;
  isStorageShipping?: string;
  laboratoryId?: string;
  nbReimbDewars?: string;
  proposalId: number;
  returnCourier?: string;
  returnLabContactId: number;
  sampleChangerLocation: string;
  sampleCount: number;
  sendingLabContactId: number;
  sessionEndDate?: string;
  sessionId?: string;
  sessionStartDate?: string;
  shippingId: number;
  shippingName: string;
  shippingStatus: string;
  shippingType: string;
  storageLocation: string;
  trackingNumberFromSynchrotron?: string;
  trackingNumberToSynchrotron?: string;
  transportValue: number;
  type: string;
}
export interface Shipment {
  shippingId: number;
  name: string;
  status: string;
  creationDate: string;
  dewars: ContainerDewar[];
}
