export interface Grid {
  progressMotionCor: number;
  progressCtf: number;
  dataCollectionId: number;
  startTime: string;
  movieCount: number;
}

export interface SampleList {
  sampleName: string;
  proposalName: string;
  gridSquaresCount: number;
  totalNumberOfMovies: number;
  noFrames: number;
  voltage: number;
  grids: Grid[];
  magnification: string | null;
  samplingRate: number;
}
interface Statistics {
  ctfCorrectionCount: number;
  dataCollectionId: number;
  motionCorrectionCount: number;
  movieCount: number;
}

export interface DataCollections {
  dataCollectionIdList: string;
  magnificationList: string;
  totalNumberOfDataCollections: number;
  stats: Statistics[];
  imagesCount: number;
  DataCollection_voltage: number;
  DataCollection_xBeamPix: number;
  BLSample_name: string;
  startTimeList: string;
}
