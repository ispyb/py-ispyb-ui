import { commaSeparatedToNumberArray } from 'legacy/helpers/numerictransformation';
import {
  StatisticsPlotData,
  Record,
  DataCollections,
  SampleList,
  Grid,
} from 'legacy/pages/em/model';
import { useMemo } from 'react';
/**
 * Basically this method parses dataCollection to SampleList
 * @param dataCollections
 * @param proposalName
 * @returns
 */
export function useDataCollectionToGridSquares(
  dataCollections: DataCollections[],
  proposalName: string
) {
  return useMemo(() => {
    const sampleList: SampleList[] = [];
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
        imageDirectoryList,
      } = dataCollection;
      const totalNumberOfMovies = statistics
        .map((stat) => stat.movieCount)
        .reduce((total, num) => total + num);
      const noFrames = commaSeparatedToNumberArray(framesCount)[0];
      const dataCollectionIdArray =
        commaSeparatedToNumberArray(dataCollectionIdList);
      const startTimeList = dataCollection.startTimeList.split(',');
      const magnificationArray = commaSeparatedToNumberArray(magnificationList);
      const progressMotionCorArray = [];
      const progressCtfArray = [];
      const imageDirectoryArray = imageDirectoryList.split(',');

      const grids: Grid[] = [];
      for (let i = 0; i < dataCollectionIdArray.length; i++) {
        if (statistics[i]) {
          const progressMotionCor =
            (statistics[i].motionCorrectionCount / statistics[i].movieCount) *
            100;
          const progressCtf =
            (statistics[i].ctfCorrectionCount / statistics[i].movieCount) * 100;
          progressMotionCorArray.push(Math.round(progressMotionCor * 10) / 10);
          progressCtfArray.push(Math.round(progressCtf * 10) / 10);
          grids.push({
            progressMotionCor: Math.round(
              (statistics[i].motionCorrectionCount / statistics[i].movieCount) *
                100
            ),
            progressCtf: Math.round(progressCtf * 10) / 10,
            dataCollectionId: dataCollectionIdArray[i],
            startTime: startTimeList[i],
            movieCount: statistics[i].movieCount,
            imageDirectory: imageDirectoryArray[i],
          });
        } else {
          grids.push({
            progressMotionCor: 0,
            progressCtf: 0,
            dataCollectionId: dataCollectionIdArray[i],
            startTime: startTimeList[i],
            movieCount: statistics[i].movieCount,
            imageDirectory: imageDirectoryArray[i],
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
        grids: grids.reverse(),
        magnification: magnificationArray[0] ? magnificationArray[0] : null,
        samplingRate,
      });
    });

    return sampleList;
  }, [dataCollections, proposalName]);
}

function getLength(min: number, max: number, data: number[]) {
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] >= min && data[i] <= max) {
      count = count + 1;
    }
  }
  return count;
}

function getDistribution(
  data: number[],
  minOrverride?: number,
  maxOrverride?: number
) {
  const max = maxOrverride !== undefined ? maxOrverride : Math.max(...data);
  const min = minOrverride !== undefined ? minOrverride : Math.min(...data, 0);

  const intervals = 50;
  const distribution = [];
  const size = (max - min) / intervals;

  for (let i = min; i < max; i = i + size) {
    const localmin = i;
    const localmax = localmin + size;
    distribution.push([
      localmin.toFixed(3),
      getLength(localmin, localmax, data),
    ]);
  }

  return distribution;
}

export function useGridSquareStatisticsToPlot(
  data: Record[]
): StatisticsPlotData {
  return useMemo(() => {
    const movieNumber = [];
    const averageData = [];
    const defocusU = [];
    const defocusV = [];
    const resolution = [];
    const angle = [];
    const defocusDifference = [];
    const movieId = [];
    const collectionId = [];
    let resolutionDistribution: (string | number)[][] = [];
    let defocusUDistribution: (string | number)[][] = [];
    let defocusVDistribution: (string | number)[][] = [];
    let angleDistribution: (string | number)[][] = [];

    if (data && data.length > 0) {
      data.sort(function (a, b) {
        return a.movieId - b.movieId;
      });
      for (let i = 0; i < data.length; i++) {
        movieNumber.push(i + 1);
        movieId.push(data[i].movieId);
        collectionId.push(data[i].dataCollectionId);
        averageData.push(parseFloat(data[i].averageMotionPerFrame));
        const U = parseFloat(data[i].defocusU) / 10000.0;
        const V = parseFloat(data[i].defocusV) / 10000.0;
        defocusU.push(U);
        defocusV.push(V);
        defocusDifference.push(Math.abs(U - V) / ((U + V) / 2.0));
        resolution.push(parseFloat(data[i].resolutionLimit));
        angle.push(parseFloat(data[i].angle));
      }
      resolutionDistribution = getDistribution(resolution);

      //same scale for defocus
      const maxDefocus = Math.max(...defocusU.concat(defocusV));
      const minDefocus = Math.min(...defocusU.concat(defocusV));
      defocusUDistribution = getDistribution(defocusU, minDefocus, maxDefocus);
      defocusVDistribution = getDistribution(defocusV, minDefocus, maxDefocus);
      angleDistribution = getDistribution(angle);
    }

    return {
      movieNumber,
      averageData,
      defocusU,
      defocusV,
      resolution,
      resolutionDistribution,
      defocusUDistribution,
      defocusVDistribution,
      angleDistribution,
      angle,
      defocusDifference,
      movieId,
      collectionId,
    };
  }, [data]);
}
