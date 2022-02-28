import { spaceGroupLongNames, spaceGroupShortNames } from 'constants/spacegroups';
import { convertToFixed } from 'helpers/numerictransformation';
import _ from 'lodash';
import { Dictionary } from 'lodash';
import { DataCollectionGroup } from 'pages/mx/model';

export interface Shell {
  label?: string;
  programId?: string;
  v_datacollection_processingStatus?: string;
  processingProgram?: string;
  processingProgramId?: string;
  scalingStatisticsType?: string;
  rMerge?: string;
  completeness?: string;
  resolutionLimitHigh?: string;
  resolutionLimitLow?: string;
  cell_a?: string;
  cell_b?: string;
  cell_c?: string;
  cell_alpha?: string;
  cell_beta?: string;
  cell_gamma?: string;
  v_datacollection_summary_phasing_anomalous?: boolean;
  v_datacollection_summary_phasing_autoproc_space_group?: string;
}

export interface Shells {
  refShell: Shell;
  shells: Dictionary<Shell>;
}

function getArrayValue(array: string | undefined, index: number): string | undefined {
  if (array) {
    try {
      return array.split(',')[index].trim();
    } catch (e) {
      return undefined;
    }
  }
}

function getAnomalousArrayValue(array: string | undefined, index: number): boolean | undefined {
  const anomalous = getArrayValue(array, index);
  if (anomalous === '0') {
    return false;
  }
  if (anomalous === '1') {
    return true;
  }
  return undefined;
}
function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export function parseResults(dataCollectionGroup: DataCollectionGroup): Shells[] {
  const {
    autoProcIds,
    processingStatus,
    processingPrograms,
    rMerges,
    completenessList,
    resolutionsLimitHigh,
    resolutionsLimitLow,
    Autoprocessing_cell_alpha,
    Autoprocessing_cell_beta,
    Autoprocessing_cell_gamma,
    Autoprocessing_cell_a,
    Autoprocessing_cell_b,
    Autoprocessing_cell_c,
    Autoprocessing_anomalous,
    AutoProc_spaceGroups,
    scalingStatisticsTypes,
  } = dataCollectionGroup;
  const results: Shells[] = [];
  if (autoProcIds) {
    /** in this array each program is triple because of inner, overall and outer shells */
    const programIds = autoProcIds.split(',');

    /** statisticsTypePrograms will contain every entry for type of shell and program */
    const statisticsTypePrograms: Shell[] = [];
    /** Creating container for programs */

    for (let i = 0; i < programIds.length; i++) {
      statisticsTypePrograms.push({
        programId: programIds[i].trim(),
        v_datacollection_processingStatus: getArrayValue(processingStatus, i),
        processingProgram: getArrayValue(processingPrograms, i),
        processingProgramId: getArrayValue(autoProcIds, i),
        scalingStatisticsType: getArrayValue(scalingStatisticsTypes, i),
        rMerge: convertToFixed(getArrayValue(rMerges, i), 1),
        completeness: convertToFixed(getArrayValue(completenessList, i), 1),
        resolutionLimitHigh: convertToFixed(getArrayValue(resolutionsLimitHigh, i), 1),
        resolutionLimitLow: convertToFixed(getArrayValue(resolutionsLimitLow, i), 1),
        cell_a: convertToFixed(getArrayValue(Autoprocessing_cell_a, i), 1),
        cell_b: convertToFixed(getArrayValue(Autoprocessing_cell_b, i), 1),
        cell_c: convertToFixed(getArrayValue(Autoprocessing_cell_c, i), 1),
        cell_alpha: convertToFixed(getArrayValue(Autoprocessing_cell_alpha, i), 1),
        cell_beta: convertToFixed(getArrayValue(Autoprocessing_cell_beta, i), 1),
        cell_gamma: convertToFixed(getArrayValue(Autoprocessing_cell_gamma, i), 1),
        v_datacollection_summary_phasing_anomalous: getAnomalousArrayValue(Autoprocessing_anomalous, i),
        v_datacollection_summary_phasing_autoproc_space_group: getArrayValue(AutoProc_spaceGroups, i),
      });
    }

    const groupedByProgramId = _.groupBy(statisticsTypePrograms, (v) => v.programId);
    const mapped_scalingStatisticsTypes = _.filter(_.uniq(_.map(statisticsTypePrograms, (value) => value.scalingStatisticsType)), notEmpty);
    groupedByProgramId;
    for (const programId in groupedByProgramId) {
      try {
        const group = groupedByProgramId[programId];
        group;
        const keyByScalingStatisticsType = _.keyBy(group, 'scalingStatisticsType');
        results.push({
          refShell: keyByScalingStatisticsType[mapped_scalingStatisticsTypes[0]],
          shells: keyByScalingStatisticsType,
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
  return results;
}

// eslint-disable-next-line no-unused-vars
function sort(array: Shells[], spacegroudFieldSelector: (res: Shell) => string) {
  /** First sorting autoprocessing with rMerge < 10 */
  const minus10Rmerge = _.filter(array, function (o) {
    if (o.shells.innerShell) {
      if (o.shells.innerShell.rMerge) {
        if (Number(o.shells.innerShell.rMerge) <= 10 && Number(o.shells.innerShell.rMerge) > 0) {
          return true;
        }
      }
    }
    return false;
  });

  /** Second we get rMerge > 10 */
  const plus10Rmerge = _.filter(array, function (o) {
    if (o.shells.innerShell) {
      if (o.shells.innerShell.rMerge) {
        if (Number(o.shells.innerShell.rMerge) > 10 || Number(o.shells.innerShell.rMerge) <= 0) {
          return true;
        }
      }
    }
    return false;
  });

  function sortByHighestSymmetry(a: Shells, b: Shells) {
    const spaceGroupA = spacegroudFieldSelector(a.refShell).replace(/\s/g, '');
    const spaceGroupB = spacegroudFieldSelector(b.refShell).replace(/\s/g, '');

    let indexOfSpaceGroupA = _.indexOf(spaceGroupShortNames, spaceGroupA);
    if (indexOfSpaceGroupA === -1) {
      /** If not found check with long name */
      indexOfSpaceGroupA = _.indexOf(spaceGroupLongNames, spaceGroupA);
    }

    let indexOfSpaceGroupB = _.indexOf(spaceGroupShortNames, spaceGroupB);
    if (indexOfSpaceGroupB === -1) {
      indexOfSpaceGroupB = _.indexOf(spaceGroupLongNames, spaceGroupB);
    }

    if (indexOfSpaceGroupA === indexOfSpaceGroupB) {
      return parseFloat(a.shells.innerShell.rMerge || '0') - parseFloat(b.shells.innerShell.rMerge || '0');
    }
    return indexOfSpaceGroupB - indexOfSpaceGroupA;
  }

  function sortByrMerge(a: Shells, b: Shells) {
    return parseFloat(a.shells.innerShell.rMerge || '0') - parseFloat(b.shells.innerShell.rMerge || '0');
  }

  minus10Rmerge.sort(sortByHighestSymmetry);
  plus10Rmerge.sort(sortByrMerge);

  /** Setting lables */
  if (plus10Rmerge) {
    for (let i = 0; i < plus10Rmerge.length; i++) {
      plus10Rmerge[i].refShell.label = 'rMerge > 10';
    }
  }

  return _.concat(minus10Rmerge, plus10Rmerge);
}

function rank(results: Shells[]): Shells[] {
  const anomalous = _.filter(results, function (os) {
    const o = os.refShell;
    return o.v_datacollection_summary_phasing_anomalous === true && (o.v_datacollection_processingStatus === 'SUCCESS' || o.v_datacollection_processingStatus === '1');
  });
  const nonanomalous = _.filter(results, function (os) {
    const o = os.refShell;
    return o.v_datacollection_summary_phasing_anomalous === false && (o.v_datacollection_processingStatus === 'SUCCESS' || o.v_datacollection_processingStatus === '1');
  });
  const running = _.filter(results, function (os) {
    const o = os.refShell;
    return o.v_datacollection_processingStatus === 'RUNNING';
  });
  const failed = _.filter(results, function (os) {
    const o = os.refShell;
    return o.v_datacollection_processingStatus === 'FAILED' || o.v_datacollection_processingStatus === '0';
  });

  const anomalousdata = sort(anomalous, (res) => res.v_datacollection_summary_phasing_autoproc_space_group || '');
  const nonanomalousdata = sort(nonanomalous, (res) => res.v_datacollection_summary_phasing_autoproc_space_group || '');

  return _.concat(nonanomalousdata, anomalousdata, running, failed);
}

export function getBestResult(dataCollectionGroup: DataCollectionGroup): Shells | undefined {
  const sorted = rank(parseResults(dataCollectionGroup));
  if (sorted.length > 0) {
    return sorted[0];
  }
}
