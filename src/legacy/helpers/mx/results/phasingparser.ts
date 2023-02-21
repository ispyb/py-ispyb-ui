import { getPhasingAttachmentDownloadUrl } from 'legacy/api/ispyb';
import { PhasingInfo } from 'legacy/pages/mx/model';

const MOL_TYPES = ['density', 'refined', 'MR', 'lig', 'new_ligand'] as const;

type MolType = typeof MOL_TYPES[number];

export type MolData = {
  pdb: string;
  map1: string;
  map2: string;
  peaks?: string;
  type: MolType;
  phasing: PhasingInfo;
};

export type Molecules = MolData[];

export function hasAnyMol(molecules?: Molecules) {
  if (!molecules) return false;
  return molecules.length > 0;
}

export function getBestMol(molecules?: Molecules) {
  if (!molecules || molecules.length === 0) return undefined;
  return molecules.sort((a, b) => {
    const aIndex = MOL_TYPES.indexOf(a.type);
    const bIndex = MOL_TYPES.indexOf(b.type);
    return aIndex - bIndex;
  })[0];
}

export function getMolDisplayName(mol: MolData) {
  switch (mol.type) {
    case 'lig':
      return 'Ligand';
    case 'new_ligand':
      return 'New Ligand';
    case 'MR':
      return 'MR';
    case 'refined':
      return 'Refined';
    case 'density':
      return 'Density';
  }
  return mol.type;
}

export function parseMols(
  phasing: PhasingInfo,
  proposalName: string,
  urlPrefix: string
) {
  let res: Molecules = [];

  if (
    phasing.PhasingStep_phasingStepType &&
    ['MODELBUILDING', 'REFINEMENT', 'LIGAND_FIT'].includes(
      phasing.PhasingStep_phasingStepType
    )
  ) {
    if (
      phasing.PhasingStep_phasingStepType === 'MODELBUILDING' &&
      phasing.map &&
      phasing.pdb
    ) {
      res.push(
        buildMolData(
          phasing.pdb,
          phasing.map.split(','),
          undefined,
          urlPrefix,
          proposalName,
          'density',
          phasing
        )
      );
    } else if (
      phasing.PhasingStep_phasingStepType === 'REFINEMENT' ||
      phasing.PhasingStep_phasingStepType === 'LIGAND_FIT'
    ) {
      const maps = parseAttachments(phasing.mapFileName, phasing.map);
      const csvs = parseAttachments(phasing.csvFileName, phasing.csv);
      const pdbs = parseAttachments(phasing.pdbFileName, phasing.pdb);
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
            phasing
          )
        );
      }
      if (
        'new_ligand.pdb' in pdbs &&
        'lig_2mFo-DFc.map' in maps &&
        'lig_mFo-DFc.map' in maps
      ) {
        res.push(
          buildMolData(
            pdbs['new_ligand.pdb'],
            [maps['lig_2mFo-DFc.map'], maps['lig_mFo-DFc.map']],
            undefined,
            urlPrefix,
            proposalName,
            'new_ligand',
            phasing
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
            phasing
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
            phasing
          )
        );
      }
    }
  }
  return res;
}

function buildMolData(
  pdb: string,
  maps: string[],
  peaks: string | undefined,
  urlPrefix: string,
  proposalName: string,
  type: MolType,
  phasing: PhasingInfo
): MolData {
  const pdbUrl =
    urlPrefix +
    getPhasingAttachmentDownloadUrl({
      proposalName,
      phasingprogramattachmentid: pdb,
    }).url;
  const mapFiles = maps.map(
    (m) =>
      urlPrefix +
      getPhasingAttachmentDownloadUrl({
        proposalName,
        phasingprogramattachmentid: m,
      }).url
  );
  const peaksUrl = peaks
    ? urlPrefix +
      getPhasingAttachmentDownloadUrl({
        proposalName,
        phasingprogramattachmentid: peaks,
      }).url
    : undefined;

  return {
    pdb: pdbUrl,
    map1: mapFiles[0],
    map2: mapFiles[1],
    peaks: peaksUrl,
    type,
    phasing,
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
