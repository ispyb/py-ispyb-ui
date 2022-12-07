import { Crystal, Protein } from 'legacy/pages/model';
import { ShippingContainer, ShippingSample } from '../model';

export function containerToTableData(container: ShippingContainer) {
  function getSample(index: number) {
    for (const sample of container.sampleVOs) {
      if (Number(sample.location) === index + 1) {
        return sample;
      }
    }
    return undefined;
  }

  const data = [...Array(container.capacity).keys()]
    .map(getSample)
    .map(getData);
  return data;
}

function getData(sample: ShippingSample | undefined, index: number) {
  if (sample) {
    return [
      sample.location, //0
      sample.crystalVO?.proteinVO.acronym, //1
      sample.name, //2
      sample.code, //3
      getCrystalInfo(sample.crystalVO), //4
      sample.diffractionPlanVO.experimentKind, //5
      sample.diffractionPlanVO.aimedResolution, //6
      sample.diffractionPlanVO.requiredResolution, //7
      sample.diffractionPlanVO.preferredBeamDiameter, //8
      sample.diffractionPlanVO.numberOfPositions, //9
      sample.diffractionPlanVO.aimedMultiplicity, //10
      sample.diffractionPlanVO.aimedCompleteness, //11
      sample.diffractionPlanVO.forcedSpaceGroup, //12
      sample.diffractionPlanVO.radiationSensitivity, //13
      sample.smiles, //14
      sample.diffractionPlanVO.axisRange, //15
      sample.diffractionPlanVO.minOscWidth, //16
      sample.diffractionPlanVO.observedResolution, //17
      sample.comments, //18
      sample.structureStage, //19
    ];
  } else return [index + 1];
}

export function getCrystalInfo(crystal?: Crystal) {
  if (crystal === undefined) return 'Not set';
  const getCellInfo = (crystal: Crystal) => {
    if (
      crystal.cellA === undefined &&
      crystal.cellB === undefined &&
      crystal.cellC === undefined &&
      crystal.cellAlpha === undefined &&
      crystal.cellBeta === undefined &&
      crystal.cellGamma === undefined
    ) {
      return undefined;
    } else if (
      crystal.cellA === 0 &&
      crystal.cellB === 0 &&
      crystal.cellC === 0 &&
      crystal.cellAlpha === 0 &&
      crystal.cellBeta === 0 &&
      crystal.cellGamma === 0
    ) {
      return '';
    }
    return (
      ' - (' +
      crystal.cellA +
      ' , ' +
      crystal.cellB +
      ' , ' +
      crystal.cellC +
      ' - ' +
      crystal.cellAlpha +
      ' , ' +
      crystal.cellBeta +
      ' , ' +
      crystal.cellGamma +
      ')'
    );
  };
  const spaceGroup = crystal.spaceGroup?.trim().length
    ? crystal.spaceGroup
    : undefined;
  const cell = getCellInfo(crystal);

  if (spaceGroup || cell) {
    return (
      (spaceGroup === undefined ? 'undefined' : spaceGroup) +
      (cell === undefined ? ' - undefined' : cell)
    );
  }
  return 'Not set';
}

export function parseCrystalInfo(
  data: (string | number | undefined)[],
  crystals: Crystal[],
  proteins: Protein[]
): Crystal | undefined {
  const get = (index: number) => {
    if (data.length <= index) return undefined;
    return data[index];
  };
  const proteinData = get(1);
  const crystalData = get(4);

  if (proteinData === undefined || crystalData === undefined) return undefined;

  //look for existing crystal
  const crystalSearch = crystals
    .filter((crystal) => {
      return crystal.proteinVO.acronym === proteinData;
    })
    .filter((crystal) => {
      return getCrystalInfo(crystal) === crystalData;
    });
  if (crystalSearch.length) {
    return JSON.parse(JSON.stringify(crystalSearch[0]));
  }

  //look for protein
  const proteinVO = proteins.filter((protein) => {
    return protein.acronym === proteinData;
  })[0];

  if (crystalData === 'Not set')
    return {
      crystalId: undefined,
      proteinVO,
      spaceGroup: undefined,
      cellA: undefined,
      cellB: undefined,
      cellC: undefined,
      cellAlpha: undefined,
      cellBeta: undefined,
      cellGamma: undefined,
      comments: undefined,
    };

  const splitted = String(crystalData).split('-');
  const spaceGroup = splitted[0].trim();
  if (splitted.length === 1)
    return {
      crystalId: undefined,
      proteinVO,
      spaceGroup,
      cellA: 0,
      cellB: 0,
      cellC: 0,
      cellAlpha: 0,
      cellBeta: 0,
      cellGamma: 0,
      comments: undefined,
    };

  const cells = (splitted[1] + '-' + splitted[2])
    .trim()
    .replace(/[{()}]/g, '')
    .replace(/\s+/g, '');
  const cellA = Number(
    cells.split('-')[0].split(',')[0] === 'null'
      ? null
      : cells.split('-')[0].split(',')[0]
  );
  const cellB = Number(
    cells.split('-')[0].split(',')[1] === 'null'
      ? null
      : cells.split('-')[0].split(',')[1]
  );
  const cellC = Number(
    cells.split('-')[0].split(',')[1] === 'null'
      ? null
      : cells.split('-')[0].split(',')[2]
  );
  const cellAlpha = Number(
    cells.split('-')[1].split(',')[0] === 'null'
      ? null
      : cells.split('-')[1].split(',')[0]
  );
  const cellBeta = Number(
    cells.split('-')[1].split(',')[1] === 'null'
      ? null
      : cells.split('-')[1].split(',')[1]
  );
  const cellGamma = Number(
    cells.split('-')[1].split(',')[2] === 'null'
      ? null
      : cells.split('-')[1].split(',')[2]
  );
  return {
    crystalId: undefined,
    proteinVO,
    spaceGroup,
    cellA,
    cellB,
    cellC,
    cellAlpha,
    cellBeta,
    cellGamma,
    comments: undefined,
  };
}

export function parseTableData(
  data: (string | number | undefined)[][],
  crystals: Crystal[],
  proteins: Protein[],
  container: ShippingContainer
): ShippingContainer {
  const samples: ShippingSample[] = [];
  for (const sample of data.map((d) =>
    parseSample(d, crystals, proteins, container.sampleVOs)
  )) {
    if (sample !== undefined) samples.push(sample);
  }
  return {
    ...container,
    sampleVOs: samples,
  };
}

function parseSample(
  data: (string | number | undefined)[],
  crystals: Crystal[],
  proteins: Protein[],
  samples: ShippingSample[]
): ShippingSample | undefined {
  const getString = (index: number) => {
    if (data.length <= index) return undefined;
    const r = data[index];
    if (r === undefined) return undefined;
    return String(r);
  };
  const getNumber = (index: number) => {
    if (data.length <= index) return undefined;
    const r = data[index];
    if (r === undefined) return undefined;
    return Number(r);
  };

  if (
    data.filter((d) => {
      return d !== null && d !== undefined && d !== '';
    }).length <= 1
  ) {
    return undefined;
  }

  const location = getString(0) || 'undefined';
  const sample_filter = samples.filter((s) => s.location === location);
  const sample = sample_filter.length
    ? { ...sample_filter[0] }
    : { diffractionPlanVO: {} };

  return {
    ...sample,
    location,
    name: getString(2),
    code: getString(3),
    smiles: getString(14),
    comments: getString(18),
    structureStage: getString(19),
    crystalVO: parseCrystalInfo(data, crystals, proteins),
    diffractionPlanVO: {
      ...sample.diffractionPlanVO,
      experimentKind: getString(5),
      aimedResolution: getNumber(6),
      requiredResolution: getNumber(7),
      preferredBeamDiameter: getNumber(8),
      numberOfPositions: getNumber(9),
      aimedMultiplicity: getNumber(10),
      aimedCompleteness: getNumber(11),
      forcedSpaceGroup: getString(12),
      radiationSensitivity: getNumber(13),
      axisRange: getNumber(15),
      minOscWidth: getNumber(16),
      observedResolution: getNumber(17),
    },
  };
}
