import { commaSeparatedToNumberArray } from 'helpers/numerictransformation';

export function useDataCollectionToGridSquares(dataCollections, proposalName) {
  let sampleList = [];
  dataCollections.forEach((dataCollection) => {
    const {
      dataCollectionIdList,
      magnificationList,
      totalNumberOfDataCollections: gridSquaresCount,
      stats: statistics,
      imagesCount: framesCount,
      DataCollection_voltage: voltage,
      DataCollection_xBeamPix: samplingRate,
      BLSample_name: sampleName,
    } = dataCollection;
    let totalNumberOfMovies = statistics.map((stat) => stat.movieCount).reduce((total, num) => total + num);
    const noFrames = commaSeparatedToNumberArray(framesCount)[0];
    const dataCollectionIdArray = commaSeparatedToNumberArray(dataCollectionIdList);
    let startTimeList = dataCollection.startTimeList.split(',');
    const magnificationArray = commaSeparatedToNumberArray(magnificationList);
    const progressMotionCorArray = [];
    const progressCtfArray = [];

    let grids = [];
    for (let i = 0; i < dataCollectionIdArray.length; i++) {
      if (statistics[i]) {
        const progressMotionCor = (statistics[i].motionCorrectionCount / statistics[i].movieCount) * 100;
        const progressCtf = (statistics[i].ctfCorrectionCount / statistics[i].movieCount) * 100;
        progressMotionCorArray.push(Math.round(progressMotionCor * 10) / 10);
        progressCtfArray.push(Math.round(progressCtf * 10) / 10);
        grids.push({
          progressMotionCor: Math.round((statistics[i].motionCorrectionCount / statistics[i].movieCount) * 100),
          progressCtf: Math.round(progressCtf * 10) / 10,
          url: `/sessions/em/proposal/{proposalName}/datacollection/${dataCollectionIdArray[i]}/movies`,
          dataCollectionId: dataCollectionIdArray[i],
          startTime: startTimeList[i],
          movieCount: statistics[i].movieCount,
        });
      } else {
        grids.push({
          progressMotionCor: 0,
          progressCtf: 0,
          url: `/sessions/em/proposal/{proposalName}/datacollection/${dataCollectionIdArray[i]}/movies`,
          dataCollectionId: dataCollectionIdArray[i],
          startTime: startTimeList[i],
          movieCount: statistics[i].movieCount,
        });
      }
    }

    sampleList.push({
      sampleName,
      proposalName,
      gridSquaresCount,
      totalNumberOfMovies,
      noFrames,
      voltage,
      grids,
      magnification: magnificationArray[0] ? magnificationArray[0] : null,
      samplingRate,
    });
  });

  return sampleList;
}
