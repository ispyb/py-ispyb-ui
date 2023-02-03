import _, { trim } from 'lodash';
import { Dictionary } from 'lodash';
import { AutoProcInformation } from 'legacy/pages/mx/model';
import { getSpaceGroup } from 'helpers/spacegroups';

export interface AutoProcIntegration {
  id: number;
  programId: number;
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
  resolutionLimitHigh?: number;
  resolutionLimitLow?: number;
  multiplicity?: number;
  completeness?: number;
  multiplicityAnomalous?: number;
  completenessAnomalous?: number;
  meanIOverSigI?: number;
  rMeas?: number;
  rMerge?: number;
  rPim?: number;
  ccHalf?: number;
  ccAno?: number;
}

export const RESULT_RANK_SHELLS = ['Inner', 'Outer', 'Overall'] as const;
export type ResultRankShell = typeof RESULT_RANK_SHELLS[number];
export const RESULT_RANK_PARAM = [
  '<I/Sigma>',
  'cc(1/2)',
  'ccAno',
  'Rmerge',
] as const;
export type ResultRankParam = typeof RESULT_RANK_PARAM[number];

export function prepareArray(arrayString?: string) {
  if (arrayString) {
    return _(arrayString).split(',').map(trim).value();
  }
  return [];
}

function toNumber(value: any) {
  if (value === null || value === undefined) return undefined;
  const res = Number(value);
  if (Number.isNaN(res)) return undefined;
  return res;
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
        resolutionLimitHigh: toNumber(resolutionLimitHigh[i]),
        resolutionLimitLow: toNumber(resolutionLimitLow[i]),
        multiplicity: toNumber(multiplicity[i]),
        completeness: toNumber(completeness[i]),
        multiplicityAnomalous: toNumber(multiplicityAnomalous[i]),
        completenessAnomalous: toNumber(completenessAnomalous[i]),
        meanIOverSigI: toNumber(meanIOverSigI[i]),
        rMeas: toNumber(rMeas[i]),
        rMerge: toNumber(rMerge[i]),
        rPim: toNumber(rPim[i]),
        ccHalf: toNumber(ccHalf[i]),
        ccAno: toNumber(ccAno[i]),
      };
    });
    const inner = 'innerShell' in stats ? stats['innerShell'] : undefined;
    const outer = 'outerShell' in stats ? stats['outerShell'] : undefined;
    const overall = 'overall' in stats ? stats['overall'] : undefined;

    if (
      p.v_datacollection_processingStatus === 'SUCCESS' &&
      [inner, outer, overall].every((v) => v === undefined)
    )
      return {
        id: p.AutoProcIntegration_autoProcIntegrationId,
        programId: p.v_datacollection_summary_phasing_autoProcProgramId,
        status: 'NO_RESULTS',
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
    return {
      id: p.AutoProcIntegration_autoProcIntegrationId,
      programId: p.v_datacollection_summary_phasing_autoProcProgramId,
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

function rank(
  results: AutoProcIntegration[],
  rankShell: ResultRankShell,
  rankParam: ResultRankParam,
  successOnly: boolean = false
): AutoProcIntegration[] {
  const anomalous = results.filter(function (r) {
    return (
      r.anomalous &&
      (r.inner !== undefined ||
        r.outer !== undefined ||
        r.overall !== undefined)
    );
  });
  const nonanomalous = results.filter(function (r) {
    return (
      !r.anomalous &&
      (r.inner !== undefined ||
        r.outer !== undefined ||
        r.overall !== undefined)
    );
  });
  const running = results.filter(function (r) {
    return r.status === 'RUNNING';
  });
  const failed = results.filter(function (r) {
    return r.status === 'FAILED' || r.status === '0';
  });
  const noResult = results.filter(function (r) {
    return r.status === 'NO_RESULTS';
  });

  const anomalousdata = anomalous.sort((a, b) =>
    sort(a, b, rankShell, rankParam)
  );
  const nonanomalousdata = nonanomalous.sort((a, b) =>
    sort(a, b, rankShell, rankParam)
  );

  return _.concat(
    nonanomalousdata,
    anomalousdata,
    successOnly ? [] : noResult,
    successOnly ? [] : running,
    successOnly ? [] : failed
  );
}

function sort(
  a: AutoProcIntegration,
  b: AutoProcIntegration,
  rankShell: ResultRankShell,
  rankParam: ResultRankParam
): number {
  function getShell(i: AutoProcIntegration) {
    if (rankShell === 'Inner') return i.inner;
    if (rankShell === 'Outer') return i.outer;
    if (rankShell === 'Overall') return i.overall;
    return undefined;
  }

  function getValue(i: AutoProcIntegration) {
    if (rankParam === '<I/Sigma>') return getShell(i)?.meanIOverSigI;
    if (rankParam === 'Rmerge') return getShell(i)?.rMerge;
    if (rankParam === 'cc(1/2)') return getShell(i)?.ccHalf;
    if (rankParam === 'ccAno') return getShell(i)?.ccAno;
  }

  function getOrder() {
    if (rankParam === '<I/Sigma>') return -1;
    if (rankParam === 'Rmerge') return 1;
    if (rankParam === 'cc(1/2)') return -1;
    if (rankParam === 'ccAno') return -1;
    return -1;
  }

  const spaceGroupA = getSpaceGroup(a.spaceGroup);
  const spaceGroupB = getSpaceGroup(b.spaceGroup);

  if (
    spaceGroupA?.symopsExcludingCentering !==
    spaceGroupB?.symopsExcludingCentering
  )
    return (
      (spaceGroupB?.symopsExcludingCentering || 0) -
      (spaceGroupA?.symopsExcludingCentering || 0)
    );

  const va = getValue(a);
  const vb = getValue(b);
  if (va === vb) return 0;
  if (va === undefined) return 1;
  if (vb === undefined) return -1;
  return getOrder() * (va - vb);
}

export function getBestResult(
  procs: AutoProcInformation[],
  rankShell: ResultRankShell,
  rankParam: ResultRankParam,
  pipelines: string[],
  successOnly: boolean = true
): AutoProcIntegration | undefined {
  const sorted = getRankedResults(
    procs,
    rankShell,
    rankParam,
    pipelines,
    successOnly
  );
  if (
    sorted.length > 0 &&
    (sorted[0].inner || sorted[0].outer || sorted[0].overall)
  ) {
    return sorted[0];
  }
  return undefined;
}

export function getRankedResults(
  procs: AutoProcInformation[],
  rankShell: ResultRankShell,
  rankParam: ResultRankParam,
  pipelines: string[],
  successOnly: boolean = false
): AutoProcIntegration[] {
  const sorted = rank(parseResults(procs), rankShell, rankParam, successOnly);
  const filtered = sorted.filter(
    (v) => pipelines.includes(v.program) || pipelines.length === 0
  );
  return filtered;
}
