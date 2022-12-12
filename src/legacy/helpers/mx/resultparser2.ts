import {
  spaceGroupLongNames,
  spaceGroupShortNames,
} from 'legacy/constants/spacegroups';
import { convertToFixed } from 'legacy/helpers/numerictransformation';
import _, { trim } from 'lodash';
import { Dictionary } from 'lodash';
import {
  AutoProcInformation,
  DataCollectionGroup,
} from 'legacy/pages/mx/model';

export interface AutoProcIntegration {
  id: number;
  status: string;
  program: string;
  anomalous: boolean;
  overall?: AutoProcStatistics;
  outer?: AutoProcStatistics;
  inner?: AutoProcStatistics;
  cell_a: number;
  cell_b: number;
  cell_c: number;
  cell_alpha: number;
  cell_beta: number;
  cell_gamma: number;
  spaceGroup: string;
}

export interface AutoProcStatistics {
  type: string;
  resolutionLimitHigh: number;
  resolutionLimitLow: number;
  multiplicity: number;
  completeness: number;
  multiplicityAnomalous: number;
  completenessAnomalous: number;
  meanIOverSigI: number;
  rMeas: number;
  rMerge: number;
  rPim: number;
  ccHalf: number;
  ccAno: number;
}

export function prepareArray(arrayString?: string) {
  if (arrayString) {
    return _(arrayString).split(',').map(trim).value();
  }
  return [];
}

export function parseResults(
  procs: AutoProcInformation[]
): AutoProcIntegration[] {
  return procs.map((p) => {
    const shells = prepareArray(p.scalingStatisticsType);
    const resolutionLimitHigh = prepareArray(p.resolutionLimitHigh);
    const resolutionLimitLow = prepareArray(p.resolutionLimitLow);
    const multiplicity = prepareArray(p.multiplicity);
    const completeness = prepareArray(p.completeness);
    const multiplicityAnomalous = prepareArray(p.anomalousMultiplicity);
    const completenessAnomalous = prepareArray(p.anomalousCompleteness);
    const meanIOverSigI = prepareArray(p.meanIOverSigI);
    const rMeas = prepareArray(p.rMeasAllIPlusIMinus);
    const rMerge = prepareArray(p.rMerge);
    const rPim = prepareArray(p.rPimWithinIPlusIMinus);
    const ccHalf = prepareArray(p.ccHalf);
    const ccAno = prepareArray(p.ccAno);
    const stats: Dictionary<AutoProcStatistics> = {};
    shells.forEach((s, i) => {
      stats[s] = {
        type: s,
        resolutionLimitHigh: Number(resolutionLimitHigh[i]),
        resolutionLimitLow: Number(resolutionLimitLow[i]),
        multiplicity: Number(multiplicity[i]),
        completeness: Number(completeness[i]),
        multiplicityAnomalous: Number(multiplicityAnomalous[i]),
        completenessAnomalous: Number(completenessAnomalous[i]),
        meanIOverSigI: Number(meanIOverSigI[i]),
        rMeas: Number(rMeas[i]),
        rMerge: Number(rMerge[i]),
        rPim: Number(rPim[i]),
        ccHalf: Number(ccHalf[i]),
        ccAno: Number(ccAno[i]),
      };
    });
    const inner = 'innerShell' in stats ? stats['innerShell'] : undefined;
    const outer = 'outerShell' in stats ? stats['outerShell'] : undefined;
    const overall = 'overall' in stats ? stats['overall'] : undefined;

    return {
      id: p.AutoProcIntegration_autoProcIntegrationId,
      status: p.v_datacollection_processingStatus,
      program: p.v_datacollection_processingPrograms,
      anomalous: p.v_datacollection_summary_phasing_anomalous,
      cell_a: p.v_datacollection_summary_phasing_cell_a,
      cell_b: p.v_datacollection_summary_phasing_cell_b,
      cell_c: p.v_datacollection_summary_phasing_cell_c,
      cell_alpha: p.v_datacollection_summary_phasing_cell_alpha,
      cell_beta: p.v_datacollection_summary_phasing_cell_beta,
      cell_gamma: p.v_datacollection_summary_phasing_cell_gamma,
      spaceGroup: p.v_datacollection_summary_phasing_autoproc_space_group,
      inner,
      outer,
      overall,
    };
  });
}

function rank(results: AutoProcIntegration[]): AutoProcIntegration[] {
  const anomalous = results.filter(function (r) {
    return (
      r.anomalous &&
      (r.inner !== undefined || r.outer !== undefined || r.overall)
    );
  });
  const nonanomalous = results.filter(function (r) {
    return (
      !r.anomalous &&
      (r.inner !== undefined || r.outer !== undefined || r.overall)
    );
  });
  const running = results.filter(function (r) {
    return r.status === 'RUNNING';
  });
  const failed = results.filter(function (r) {
    return r.status === 'FAILED' || r.status === '0';
  });

  const anomalousdata = sort(anomalous);
  const nonanomalousdata = sort(nonanomalous);

  return _.concat(nonanomalousdata, anomalousdata, running, failed);
}

function sort(array: AutoProcIntegration[]) {
  /** First sorting autoprocessing with rMerge < 10 */
  const minus10Rmerge = array.filter(function (o) {
    return (
      o.inner !== undefined &&
      Number(o.inner.rMerge) <= 10 &&
      Number(o.inner.rMerge) > 0
    );
  });

  /** Second we get rMerge > 10 */
  const plus10Rmerge = array.filter(function (o) {
    return (
      o.inner !== undefined &&
      (Number(o.inner.rMerge) > 10 || Number(o.inner.rMerge) <= 0)
    );
  });

  function sortByrMerge(a: AutoProcIntegration, b: AutoProcIntegration) {
    return (a.inner?.rMerge || 0) - (b.inner?.rMerge || 0);
  }

  function sortByHighestSymmetry(
    a: AutoProcIntegration,
    b: AutoProcIntegration
  ) {
    const spaceGroupA = a.spaceGroup?.replace(/\s/g, '');
    const spaceGroupB = a.spaceGroup?.replace(/\s/g, '');

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
      return sortByrMerge(a, b);
    }
    return indexOfSpaceGroupB - indexOfSpaceGroupA;
  }

  minus10Rmerge.sort(sortByHighestSymmetry);
  plus10Rmerge.sort(sortByrMerge);

  return _.concat(minus10Rmerge, plus10Rmerge);
}

export function getBestResult(
  procs: AutoProcInformation[]
): AutoProcIntegration | undefined {
  const sorted = getRankedResults(procs);
  if (sorted.length > 0) {
    return sorted[0];
  }
}

export function getRankedResults(
  procs: AutoProcInformation[]
): AutoProcIntegration[] {
  const sorted = rank(parseResults(procs));
  return sorted;
}
