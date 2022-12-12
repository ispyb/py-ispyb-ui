import {
  spaceGroupLongNames,
  spaceGroupShortNames,
} from 'legacy/constants/spacegroups';
import { convertToFixed } from 'legacy/helpers/numerictransformation';
import _, { trim } from 'lodash';
import { Dictionary } from 'lodash';
import { DataCollectionGroup } from 'legacy/pages/mx/model';

export interface Shell {
  autoProcId?: string;
  scalingStatisticsType?: string;
  completeness?: string;
  resolutionLimitHigh?: string;
  resolutionLimitLow?: string;
  rMerge?: string;
  meanIOverSigI?: string;
  ccHalf?: string;
  spaceGroup?: string;
  cell_a?: string;
  cell_b?: string;
  cell_c?: string;
  cell_alpha?: string;
  cell_beta?: string;
  cell_gamma?: string;
  anomalous?: boolean;
  status?: string;
  progam?: string;
}

export interface Shells {
  refShell: Shell;
  shells: Dictionary<Shell>;
}

export function prepareArray(arrayString?: string) {
  if (arrayString) {
    return _(arrayString).split(',').map(trim);
  }
  const a: string[] = [];
  return _(a);
}

export function parseResults(
  dataCollectionGroup: DataCollectionGroup
): Shells[] {
  const {
    autoProcIntegrationId,
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
  if (!autoProcIntegrationId) {
    return results;
  }
  const autoProcIntegrationId_array = prepareArray(
    autoProcIntegrationId
  ).value();
  const autoProcIds_array = prepareArray(autoProcIds).value();

  if (!autoProcIntegrationId_array || !autoProcIds_array) {
    return results;
  }

  const processingStatus_array = prepareArray(processingStatus).value();
  const processingPrograms_array = prepareArray(processingPrograms).value();
  const rMerges_array = prepareArray(rMerges).value();
  const completenessList_array = prepareArray(completenessList).value();
  const resolutionsLimitHigh_array = prepareArray(resolutionsLimitHigh).value();
  const resolutionsLimitLow_array = prepareArray(resolutionsLimitLow).value();
  const Autoprocessing_cell_alpha_array = prepareArray(
    Autoprocessing_cell_alpha
  ).value();
  const Autoprocessing_cell_beta_array = prepareArray(
    Autoprocessing_cell_beta
  ).value();
  const Autoprocessing_cell_gamma_array = prepareArray(
    Autoprocessing_cell_gamma
  ).value();
  const Autoprocessing_cell_a_array = prepareArray(
    Autoprocessing_cell_a
  ).value();
  const Autoprocessing_cell_b_array = prepareArray(
    Autoprocessing_cell_b
  ).value();
  const Autoprocessing_cell_c_array = prepareArray(
    Autoprocessing_cell_c
  ).value();
  const Autoprocessing_anomalous_array = prepareArray(
    Autoprocessing_anomalous
  ).value();
  const AutoProc_spaceGroups_array = prepareArray(AutoProc_spaceGroups).value();
  const scalingStatisticsTypes_array = prepareArray(
    scalingStatisticsTypes
  ).value();

  //Build autoProcIntegration objects
  const autoProcIntegrations = _(autoProcIntegrationId_array)
    .map((id, index) => {
      return {
        id: id,
        status: processingStatus_array[index],
        anomalous: Autoprocessing_anomalous_array[index] === '1',
        progam: processingPrograms_array[index],
      };
    })
    .value();

  //Count number of autoProcIntegration for each id
  const autoProcIntegrationsCount = _(autoProcIntegrations)
    .groupBy((v) => v.id)
    .mapValues((v) => {
      return v.length;
    })
    .value();

  //Keep only those with SUCCESS and 3 occurences
  const filteredautoProcIntegrations = _(autoProcIntegrations)
    .filter((v) => v.status === 'SUCCESS')
    .filter((v) => {
      if (v.id) {
        return autoProcIntegrationsCount[v.id] === 3;
      }
      return false;
    })
    .value();

  // Build AutoProc object for each program id
  const groupedByProgramId = _(autoProcIds_array)
    .map((id, index) => {
      const r: Shell = {
        autoProcId: id,
        scalingStatisticsType: scalingStatisticsTypes_array[index],
        completeness: convertToFixed(completenessList_array[index], 1),
        resolutionLimitHigh: convertToFixed(
          resolutionsLimitHigh_array[index],
          1
        ),
        resolutionLimitLow: convertToFixed(resolutionsLimitLow_array[index], 1),
        rMerge: convertToFixed(rMerges_array[index], 1),
        spaceGroup: AutoProc_spaceGroups_array[index],
        cell_a: convertToFixed(Autoprocessing_cell_a_array[index], 1),
        cell_b: convertToFixed(Autoprocessing_cell_b_array[index], 1),
        cell_c: convertToFixed(Autoprocessing_cell_c_array[index], 1),
        cell_alpha: convertToFixed(Autoprocessing_cell_alpha_array[index], 1),
        cell_beta: convertToFixed(Autoprocessing_cell_beta_array[index], 1),
        cell_gamma: convertToFixed(Autoprocessing_cell_gamma_array[index], 1),
        ...filteredautoProcIntegrations[index],
      };
      return r;
    })
    .groupBy((v) => v.autoProcId)
    .value();

  // Build result
  for (const programId in groupedByProgramId) {
    try {
      const group = groupedByProgramId[programId];
      const keyByScalingStatisticsType = _.keyBy(
        group,
        'scalingStatisticsType'
      );
      results.push({
        refShell: keyByScalingStatisticsType['innerShell'],
        shells: keyByScalingStatisticsType,
      });
    } catch (e) {
      console.log(e);
    }
  }

  return results;
}

function sort(array: Shells[]) {
  /** First sorting autoprocessing with rMerge < 10 */
  const minus10Rmerge = _.filter(array, function (o) {
    if (o.shells.innerShell) {
      if (o.shells.innerShell.rMerge) {
        if (
          Number(o.shells.innerShell.rMerge) <= 10 &&
          Number(o.shells.innerShell.rMerge) > 0
        ) {
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
        if (
          Number(o.shells.innerShell.rMerge) > 10 ||
          Number(o.shells.innerShell.rMerge) <= 0
        ) {
          return true;
        }
      }
    }
    return false;
  });

  function sortByHighestSymmetry(a: Shells, b: Shells) {
    const spaceGroupA = a.refShell.spaceGroup?.replace(/\s/g, '');
    const spaceGroupB = a.refShell.spaceGroup?.replace(/\s/g, '');

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
      return (
        parseFloat(a.shells.innerShell.rMerge || '0') -
        parseFloat(b.shells.innerShell.rMerge || '0')
      );
    }
    return indexOfSpaceGroupB - indexOfSpaceGroupA;
  }

  function sortByrMerge(a: Shells, b: Shells) {
    return (
      parseFloat(a.shells.innerShell.rMerge || '0') -
      parseFloat(b.shells.innerShell.rMerge || '0')
    );
  }

  minus10Rmerge.sort(sortByHighestSymmetry);
  plus10Rmerge.sort(sortByrMerge);

  return _.concat(minus10Rmerge, plus10Rmerge);
}

function rank(results: Shells[]): Shells[] {
  const anomalous = _.filter(results, function (os) {
    const o = os.refShell;
    return o.anomalous === true && (o.status === 'SUCCESS' || o.status === '1');
  });
  const nonanomalous = _.filter(results, function (os) {
    const o = os.refShell;
    return (
      o.anomalous === false && (o.status === 'SUCCESS' || o.status === '1')
    );
  });
  const running = _.filter(results, function (os) {
    const o = os.refShell;
    return o.status === 'RUNNING';
  });
  const failed = _.filter(results, function (os) {
    const o = os.refShell;
    return o.status === 'FAILED' || o.status === '0';
  });

  const anomalousdata = sort(anomalous);
  const nonanomalousdata = sort(nonanomalous);

  return _.concat(nonanomalousdata, anomalousdata, running, failed);
}

export function getBestResult(
  dataCollectionGroup: DataCollectionGroup
): Shells | undefined {
  const sorted = rank(parseResults(dataCollectionGroup));
  if (sorted.length > 0) {
    return sorted[0];
  }
}
