export interface Classification {
  classDistribution: number;
  classImageFullPath: string;
  classNumber: number;
  estimatedResolution: number;
  imageDirectory: string;
  numberOfParticles: number;
  overallFourierCompleteness: number;
  particleClassificationGroupId: number;
  particleClassificationId: number;
  particlePickerId: number;
  particlesPerClass: number;
  proposalId: number;
  rotationAccuracy: number;
  sessionId: number;
  translationAccuracy: number;
}
export interface Movie {
  MotionCorrection_movieId: number;
  MotionCorrection_totalMotion: string;
  MotionCorrection_averageMotionPerFrame: string;
  MotionCorrection_lastFrame: string;
  MotionCorrection_dosePerFrame: string;
  Movie_positionX: string;
  Movie_positionY: string;
  Movie_createdTimeStamp: string;
  Movie_dataCollectionId: number;
  Movie_dosePerImage: string;
  Movie_micrographSnapshotFullPath: string;
  Movie_movieFullPath: string;
  Movie_movieId: number;
  Movie_movieNumber: number;
  Movie_fileName: string;
  CTF_CTFid: number;
  CTF_angle: string;
  CTF_createdTimeStamp: string;
  CTF_crossCorrelationCoefficient: string;
  CTF_defocusU: string;
  CTF_defocusV: string;
  CTF_estimatedBfactor: string;
  CTF_logFilePath: string;
  CTF_motionCorrectionId: number;
  CTF_resolutionLimit: string;
  CTF_spectraImageThumbnailFullPath: string;
}

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

export interface Record {
  movieId: number;
  defocusU: string;
  defocusV: string;
  averageMotionPerFrame: string;
  resolutionLimit: string;
  angle: string;
}

export interface StatisticsPlotData {
  movieNumber: number[];
  averageData: number[];
  defocusU: number[];
  defocusV: number[];
  resolution: number[];
  resolutionDistribution: (number | string)[][];
  defocusUDistribution: (number | string)[][];
  defocusVDistribution: (number | string)[][];
  angleDistribution: (number | string)[][];
  angle: number[];
  defocusDifference: number[];
}
