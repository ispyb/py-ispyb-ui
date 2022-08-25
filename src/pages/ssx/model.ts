export type SSXDataCollectionResponse = {
  ssxDataCollectionId: number;
  ssxSpecimenId: number;
  repetitionRate: number;
  energyBandwidth: number;
  monoStripe: string;
  DataCollection: DataCollectionResponse;
};

export type DataCollectionResponse = {
  dataCollectionId: number;
  dataCollectionGroupId: number;
  strategySubWedgeOrigId: number;
  detectorId: number;
  blSubSampleId: number;
  startPositionId: number;
  endPositionId: number;
  dataCollectionNumber: number;
  startTime: string;
  endTime: string;
  runStatus: string;
  axisStart: number;
  axisEnd: number;
  axisRange: number;
  overlap: number;
  numberOfImages: number;
  startImageNumber: number;
  numberOfPasses: number;
  exposureTime: number;
  imageDirectory: string;
  imagePrefix: string;
  imageSuffix: string;
  imageContainerSubPath: string;
  fileTemplate: string;
  wavelength: number;
  resolution: number;
  detectorDistance: number;
  xBeam: number;
  yBeam: number;
  xBeamPix: number;
  yBeamPix: number;
  comments: string;
  printableForReport: number;
  slitGapVertical: number;
  slitGapHorizontal: number;
  transmission: number;
  synchrotronMode: string;
  xtalSnapshotFullPath1: string;
  xtalSnapshotFullPath2: string;
  xtalSnapshotFullPath3: string;
  xtalSnapshotFullPath4: string;
  rotationAxis: string;
  phiStart: number;
  kappaStart: number;
  omegaStart: number;
  resolutionAtCorner: number;
  detector2Theta: number;
  undulatorGap1: number;
  undulatorGap2: number;
  undulatorGap3: number;
  beamSizeAtSampleX: number;
  beamSizeAtSampleY: number;
  centeringMethod: string;
  averageTemperature: number;
  actualCenteringPosition: string;
  beamShape: string;
  flux: number;
  flux_end: number;
  totalAbsorbedDose: number;
  bestWilsonPlotPath: string;
  imageQualityIndicatorsPlotPath: string;
  imageQualityIndicatorsCSVPath: string;
  blSampleId: number;
  sessionId: number;
  crystalClass: string;
  chiStart: number;
  detectorMode: string;
  actualSampleBarcode: string;
  actualSampleSlotInContainer: number;
  actualContainerBarcode: string;
  actualContainerSlotInSC: number;
  positionId: number;
  focalSpotSizeAtSampleX: number;
  polarisation: number;
  focalSpotSizeAtSampleY: number;
  apertureId: number;
  screeningOrigId: number;
  processedDataFile: string;
  datFullPath: string;
  magnification: number;
  binning: number;
  particleDiameter: number;
  boxSize_CTF: number;
  minResolution: number;
  minDefocus: number;
  maxDefocus: number;
  defocusStepSize: number;
  amountAstigmatism: number;
  extractSize: number;
  bgRadius: number;
  voltage: number;
  objAperture: number;
  c1aperture: number;
  c2aperture: number;
  c3aperture: number;
  c1lens: number;
  c2lens: number;
  c3lens: number;
  DataCollectionGroup: DataCollectionGroupResponse;
  Detector?: DetectorResponse;
};

export type DataCollectionGroupResponse = {
  dataCollectionGroupId: number;
  blSampleId: number;
  sessionId: number;
  workflowId: number;
  experimentType: string;
  startTime: string;
  endTime: string;
  crystalClass: string;
  comments: string;
  detectorMode: string;
  actualSampleBarcode: string;
  actualSampleSlotInContainer: number;
  actualContainerBarcode: string;
  actualContainerSlotInSC: number;
  xtalSnapshotFullPath: string;
  nbDataCollection?: number;
};

export type DetectorResponse = {
  detectorId: number;
  detectorType: string;
  detectorManufacturer: string;
  detectorModel: string;
  detectorPixelSizeHorizontal: number;
  detectorPixelSizeVertical: number;
  detectorSerialNumber: string;
  detectorDistanceMin: number;
  detectorDistanceMax: number;
  trustedPixelValueRangeLower: number;
  trustedPixelValueRangeUpper: number;
  sensorThickness: number;
  overload: number;
  XGeoCorr: string;
  YGeoCorr: string;
  detectorMode: string;
  detectorMaxResolution: number;
  detectorMinResolution: number;
  CS: number;
  density: number;
  composition: string;
  localName: string;
};

export type SSXSampleResponse = {
  blSampleId: number;
  diffractionPlanId: number;
  crystalId: number;
  containerId: number;
  name: string;
  code: string;
  location: string;
  holderLength: number;
  loopLength: number;
  loopType: string;
  wireWidth: number;
  comments: string;
  completionStage: string;
  structureStage: string;
  publicationStage: string;
  publicationComments: string;
  blSampleStatus: string;
  isInSampleChanger: number;
  lastKnownCenteringPosition: string;
  recordTimeStamp: string;
  SMILES: string;
  lastImageURL: string;
  positionId: number;
  blSubSampleId: number;
  screenComponentGroupId: number;
  volume: number;
  dimension1: number;
  dimension2: number;
  dimension3: number;
  shape: string;
  subLocation: number;
  Crystal: CrystalResponse;
  sample_compositions: SampleCompositionResponse[];
};

export type GraphResponse = {
  graphId: number;
  name: string;
};

export type GraphDataResponse = {
  graphId: number;
  x: number;
  y: number;
};

export type CrystalResponse = {
  crystalId: number;
  diffractionPlanId: number;
  proteinId: number;
  crystalUUID: string;
  name: string;
  spaceGroup: string;
  morphology: string;
  color: string;
  size_X: number;
  size_Y: number;
  size_Z: number;
  cell_a: number;
  cell_b: number;
  cell_c: number;
  cell_alpha: number;
  cell_beta: number;
  cell_gamma: number;
  comments: string;
  pdbFileName: string;
  pdbFilePath: string;
  recordTimeStamp: string;
  abundance: number;
  packingFraction: number;
  Protein: ProteinResponse;
  crystal_compositions: CrystalCompositionResponse[];
};

export type ProteinResponse = {
  proteinId: number;
  proposalId: number;
  name: string;
  acronym: string;
  description: string;
  hazardGroup: number;
  containmentLevel: number;
  safetyLevel: string;
  molecularMass: number;
  proteinType: string;
  sequence: string;
  personId: number;
  bltimeStamp: string;
  isCreatedBySampleSheet: number;
  externalId: string;
  componentTypeId: number;
  modId: string;
  concentrationTypeId: number;
};

export type ComponentTypeResponse = {
  name: string;
};

export type ComponentResponse = {
  componentId: number;
  componentTypeId: number;
  name: string;
  composition: string;
  concentration: number;
  proposalId: number;
  ComponentType: ComponentTypeResponse;
};

export type SampleCompositionResponse = {
  Component: ComponentResponse;
  abundance: number;
  blSampleId: number;
  componentId: number;
  concentrationTypeId: number;
  ph: number;
  ratio: number;
  sampleCompositionId: number;
};

export type CrystalCompositionResponse = {
  Component: ComponentResponse;
  abundance: number;
  crystalId: number;
  componentId: number;
  concentrationTypeId: number;
  ph: number;
  ratio: number;
  crystalCompositionId: number;
};

export type SSXSequenceEventTypeResponse = {
  name: string;
};

export type SSXSequenceEventResponse = {
  sequenceEventId: number;
  sequenceId: number;
  imageId: number;
  name: string;
  time: string;
  duration: number;
  period: number;
  repetition: number;
  SequenceEventType: SSXSequenceEventTypeResponse;
};

export type SSXSequenceResponse = {
  sequenceId: number;
  dataCollectionId: number;
  name: string;
  sequence_events: SSXSequenceEventResponse[];
};

export type SSXHitsResponse = {
  nbHits: number;
  nbIndexed: number;
  laticeType: string;
  estimatedResolution: number;
};
