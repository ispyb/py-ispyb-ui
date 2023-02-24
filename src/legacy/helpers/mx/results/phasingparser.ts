import { getPhasingAttachmentDownloadUrl } from 'legacy/api/ispyb';
import { getIcatGalleryDownloadUrl } from 'legacy/hooks/icat';
import { Dataset, getDatasetParam, getNotes } from 'legacy/hooks/icatmodel';
import { PhasingInfo } from 'legacy/pages/mx/model';
import _ from 'lodash';

const MOL_TYPES = ['SAD', 'refined', 'MR', 'lig'] as const;

type MolType = typeof MOL_TYPES[number];

export type PhasingStep = {
  phasing: PhasingInfo;
  molecules: Molecules;
  sucess: boolean;
};

export type RankedPhasingSteps = {
  method: string;
  phasings: PhasingStep[];
}[];

export type Molecules = MolData[];

export type MolData = {
  pdb: string;
  map1: string;
  map2: string;
  peaks?: string;
  type: MolType;
  displayType: string;
  displayPdb: string;
};

export function parsePhasingStep(
  phasing: Dataset,
  proposalName: string,
  urlPrefix: string
): PhasingStep | undefined {
  const p = getNotes<PhasingInfo>(phasing);
  if (!p.PhasingStep_phasingStepId) return undefined;
  const molecules = parseMols(phasing, proposalName, urlPrefix);
  return {
    phasing: p,
    molecules,
    sucess: hasAnyMol(molecules),
  };
}

export function parsePhasingSteps(
  phasings: Dataset[],
  proposalName: string,
  urlPrefix: string
): PhasingStep[] {
  const parsed: PhasingStep[] = [];
  phasings.forEach((p) => {
    const parsedPhasing = parsePhasingStep(p, proposalName, urlPrefix);
    if (parsedPhasing) {
      parsed.push(parsedPhasing);
    }
  });
  return parsed;
}

export function parseAndRankPhasingSteps(
  phasings: Dataset[],
  proposalName: string,
  urlPrefix: string
): RankedPhasingSteps {
  const parsed = parsePhasingSteps(phasings, proposalName, urlPrefix);
  return rankPhasings(parsed);
}

export function parsePhasingStepsForSummary(
  phasings: Dataset[],
  proposalName: string,
  urlPrefix: string
): PhasingStep[] {
  const ranked = parseAndRankPhasingSteps(phasings, proposalName, urlPrefix);
  const res: PhasingStep[] = [];
  ranked.forEach((r) => {
    const withMol = r.phasings.filter((p) => hasAnyMol(p.molecules));
    if (withMol.length > 0) {
      res.push(withMol[0]);
    }
  });
  return res;
}

export const PHASING_RANKING_METHOD_DESCRIPTION = [
  '',
  'Ranking is based on the following criteria:',
  '- MR: lowest FreeR value',
  '- SAD: highest partial CC value with an average fragment size >10',
];

export function rankPhasings(phasings: PhasingStep[]): RankedPhasingSteps {
  const parseSadMetrics = (p: PhasingStep) => {
    const res: { [key: string]: number } = {};
    if (!p.phasing.metric) return res;
    if (!p.phasing.statisticsValue) return res;
    _(p.phasing.metric.split(', '))
      .zip(p.phasing.statisticsValue.split(', '))
      .forEach(([metric, value]) => {
        if (metric && !Number.isNaN(Number(value))) {
          res[metric] = Number(value);
        }
      });
    return res;
  };

  return _(phasings)
    .groupBy((p) => p.phasing.PhasingStep_method)
    .map((phasings, method) => {
      const successful = phasings.filter((p) => p.sucess);
      const unsuccessful = phasings.filter((p) => !p.sucess);
      if (method === 'MR') {
        return {
          method,
          phasings: [
            ...successful.sort((a, b) => {
              return (
                Number(a.phasing.PhasingStep_lowRes) -
                Number(b.phasing.PhasingStep_lowRes)
              );
            }),
            ...unsuccessful,
          ],
        };
      }
      if (method === 'SAD') {
        const fragmentAbove10 = _(successful)
          .filter((p) => parseSadMetrics(p)['Average Fragment Length'] > 10)
          .orderBy((p) => parseSadMetrics(p)['CC of partial model'], 'desc')
          .value();
        const fragmentUnder10 = _(successful)
          .filter((p) => parseSadMetrics(p)['Average Fragment Length'] <= 10)
          .orderBy((p) => parseSadMetrics(p)['CC of partial model'], 'desc')
          .value();

        return {
          method,
          phasings: [...fragmentAbove10, ...fragmentUnder10, ...unsuccessful],
        };
      }
      return {
        method,
        phasings: phasings,
      };
    })
    .value();
}

export function hasAnyMol(molecules?: Molecules) {
  if (!molecules) return false;
  return molecules.length > 0;
}

export function parseGallery(ds: Dataset): {
  pdb?: string;
  map?: string;
  csv?: string;
  pdbFileName?: string;
  mapFileName?: string;
  csvFileName?: string;
} {
  const files = getDatasetParam(ds, 'ResourcesGalleryFilePaths');
  if (!files) return {};
  const ids = getDatasetParam(ds, 'ResourcesGallery');
  if (!ids) return {};
  const zips = _(files.split(',').map((f) => f.split('/').slice(-1)[0])).zip(
    ids.split(' ')
  );
  const pdbs = zips
    .filter(([f, id]) => {
      return Boolean(f && id && f.endsWith('.pdb'));
    })
    .value();
  const maps = zips
    .filter(([f, id]) => {
      return Boolean(f && id && f.endsWith('.map'));
    })
    .value();

  const csvs = zips
    .filter(([f, id]) => {
      return Boolean(f && id && f.endsWith('.csv'));
    })
    .value();

  return {
    pdb: pdbs.length ? pdbs.map(([f, id]) => id).join(',') : undefined,
    map: maps.length ? maps.map(([f, id]) => id).join(',') : undefined,
    csv: csvs.length ? csvs.map(([f, id]) => id).join(',') : undefined,
    pdbFileName: pdbs.length ? pdbs.map(([f, id]) => f).join(',') : undefined,
    mapFileName: maps.length ? maps.map(([f, id]) => f).join(',') : undefined,
    csvFileName: csvs.length ? csvs.map(([f, id]) => f).join(',') : undefined,
  };
}

export function parseMols(
  ds: Dataset,
  proposalName: string,
  urlPrefix: string
) {
  let res: Molecules = [];
  const phasing = getNotes<PhasingInfo>(ds);

  const gallery = parseGallery(ds);

  if (
    phasing.PhasingStep_phasingStepType === 'MODELBUILDING' &&
    gallery.map &&
    gallery.pdb &&
    gallery.pdbFileName
  ) {
    res.push(
      buildMolData(
        gallery.pdb,
        gallery.map.split(','),
        undefined,
        urlPrefix,
        proposalName,
        'SAD',
        phasing,
        gallery.pdbFileName
      )
    );
  } else {
    const maps = parseAttachments(gallery.mapFileName, gallery.map);
    const csvs = parseAttachments(gallery.csvFileName, gallery.csv);
    const pdbs = parseAttachments(gallery.pdbFileName, gallery.pdb);
    if (
      'lig.pdb' in pdbs &&
      'lig_2mFo-DFc.map' in maps &&
      'lig_mFo-DFc.map' in maps
    ) {
      res.push(
        buildMolData(
          pdbs['lig.pdb'],
          [maps['lig_2mFo-DFc.map'], maps['lig_mFo-DFc.map']],
          undefined,
          urlPrefix,
          proposalName,
          'lig',
          phasing,
          'lig.pdb'
        )
      );
    }
    if (
      'MR.pdb' in pdbs &&
      '2FOFC_MR.map' in maps &&
      'FOFC_MR.map' in maps &&
      'peaks.csv' in csvs
    ) {
      res.push(
        buildMolData(
          pdbs['MR.pdb'],
          [maps['2FOFC_MR.map'], maps['FOFC_MR.map']],
          csvs['peaks.csv'],
          urlPrefix,
          proposalName,
          'MR',
          phasing,
          'MR.pdb'
        )
      );
    }
    if (
      'refined.pdb' in pdbs &&
      '2FOFC_REFINE.map' in maps &&
      'FOFC_REFINE.map' in maps &&
      'peaks.csv' in csvs
    ) {
      res.push(
        buildMolData(
          pdbs['refined.pdb'],
          [maps['2FOFC_REFINE.map'], maps['FOFC_REFINE.map']],
          csvs['peaks.csv'],
          urlPrefix,
          proposalName,
          'refined',
          phasing,
          'refined.pdb'
        )
      );
    }
  }
  return res;
}

function getMolDisplayName(type: MolType) {
  switch (type) {
    case 'lig':
      return 'Ligand';
    case 'MR':
      return 'MR';
    case 'refined':
      return 'Refined';
    case 'SAD':
      return 'SAD';
  }
  return type;
}

function buildMolData(
  pdb: string,
  maps: string[],
  peaks: string | undefined,
  urlPrefix: string,
  proposalName: string,
  type: MolType,
  phasing: PhasingInfo,
  fileName: string
): MolData {
  const pdbUrl = urlPrefix + getIcatGalleryDownloadUrl(pdb).url;
  const mapFiles = maps.map(
    (m) => urlPrefix + getIcatGalleryDownloadUrl(m).url
  );
  const peaksUrl = peaks
    ? urlPrefix + getIcatGalleryDownloadUrl(peaks).url
    : undefined;

  return {
    pdb: pdbUrl,
    map1: mapFiles[0],
    map2: mapFiles[1],
    peaks: peaksUrl,
    type,
    displayType: getMolDisplayName(type),
    displayPdb: fileName,
  };
}

function parseAttachments(
  names?: string,
  ids?: string
): { [name: string]: string } {
  if (!ids || !names) return {};
  const idList = ids.split(',');
  const nameList = names.split(',');
  if (idList.length !== nameList.length) return {};

  const res: { [name: string]: string } = {};

  nameList.forEach((name, index) => {
    res[name] = idList[index];
  });

  return res;
}

export type PhasingTree = {
  method: string;
  root: PhasingTreeNode;
};

export type PhasingTreeNode = {
  step: PhasingStep;
  children: PhasingTreeNode[];
  success: boolean;
  isBest: boolean;
};

export function stepsToTrees(steps: PhasingStep[]): PhasingTree[] {
  const roots = steps.filter(
    (s) => s.phasing.PhasingStep_previousPhasingStepId === null
  );
  const rankedNodes = rankPhasings(steps);

  return roots.map((r) => {
    const rootNode = buildNode(r, steps, rankedNodes);

    return {
      method: r.phasing.PhasingStep_method || 'unknown',
      root: rootNode,
    };
  });
}

export function buildNode(
  step: PhasingStep,
  steps: PhasingStep[],
  rankedNodes: RankedPhasingSteps
): PhasingTreeNode {
  const children = steps.filter(
    (s) =>
      s.phasing.PhasingStep_previousPhasingStepId ===
      step.phasing.PhasingStep_phasingStepId
  );
  const childrenNodes = children.map((c) => buildNode(c, steps, rankedNodes));
  const childrenSuccess = childrenNodes.some((c) => c.success);
  const isSuccess = step.sucess || childrenSuccess;
  const isBest =
    isSuccess &&
    rankedNodes
      .map((r) => r.phasings[0])
      .some(
        (r) =>
          r?.phasing.PhasingStep_phasingStepId ===
          step.phasing.PhasingStep_phasingStepId
      );
  return {
    step: step,
    children: childrenNodes,
    success: isSuccess,
    isBest,
  };
}
