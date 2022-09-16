import { Crystal, Protein } from 'pages/model';
import { ShippingContainer, ShippingSample } from '../model';

export function containerToTableData(container: ShippingContainer) {
  function getSample(index: number) {
    for (const sample of container.sampleVOs) {
      if (Number(sample.location) == index + 1) {
        return sample;
      }
    }
    return undefined;
  }

  const data = [...Array(container.capacity).keys()].map(getSample).map(getData);
  return data;
}

function getData(sample: ShippingSample | undefined, index: number) {
  if (sample) {
    return [
      sample.location, //0
      sample.crystalVO.proteinVO.acronym, //1
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

export function getCrystalInfo(crystal: Crystal) {
  const getCellInfo = (crystal: Crystal) => {
    if (
      crystal.cellA == undefined &&
      crystal.cellB == undefined &&
      crystal.cellC == undefined &&
      crystal.cellAlpha == undefined &&
      crystal.cellBeta == undefined &&
      crystal.cellGamma == undefined
    ) {
      return undefined;
    } else if (crystal.cellA == 0 && crystal.cellB == 0 && crystal.cellC == 0 && crystal.cellAlpha == 0 && crystal.cellBeta == 0 && crystal.cellGamma == 0) {
      return '';
    }
    return ' - (' + crystal.cellA + ' , ' + crystal.cellB + ' , ' + crystal.cellC + ' - ' + crystal.cellAlpha + ' , ' + crystal.cellBeta + ' , ' + crystal.cellGamma + ')';
  };
  const spaceGroup = crystal.spaceGroup?.trim().length ? crystal.spaceGroup : undefined;
  const cell = getCellInfo(crystal);

  if (spaceGroup || cell) {
    return (spaceGroup == undefined ? 'undefined' : spaceGroup) + (cell == undefined ? ' - undefined' : cell);
  }
  return 'Not set';
}

export function parseCrystalInfo(data: (string | number | undefined)[], crystals: Crystal[], proteins: Protein[]) {
  const get = (index: number) => {
    if (data.length <= index) return undefined;
    return data[index];
  };
  const proteinData = get(1);
  const crystalData = get(4);

  //look for existing crystal
  const crystalSearch = crystals
    .filter((crystal) => {
      return crystal.proteinVO.acronym == proteinData;
    })
    .filter((crystal) => {
      return getCrystalInfo(crystal) == crystalData;
    });
  if (crystalSearch.length) {
    return JSON.parse(JSON.stringify(crystalSearch[0]));
  }

  //look for protein
  const proteinVO = proteins.filter((protein) => {
    return protein.acronym == proteinData;
  })[0];

  if (crystalData == 'Not set')
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
    };

  const splitted = String(crystalData).split('-');
  const spaceGroup = splitted[0].trim();
  if (splitted.length == 1)
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
    };

  const cells = (splitted[1] + '-' + splitted[2])
    .trim()
    .replace(/[{()}]/g, '')
    .replace(/\s+/g, '');
  const cellA = cells.split('-')[0].split(',')[0] == 'null' ? null : cells.split('-')[0].split(',')[0];
  const cellB = cells.split('-')[0].split(',')[1] == 'null' ? null : cells.split('-')[0].split(',')[1];
  const cellC = cells.split('-')[0].split(',')[1] == 'null' ? null : cells.split('-')[0].split(',')[2];
  const cellAlpha = cells.split('-')[1].split(',')[0] == 'null' ? null : cells.split('-')[1].split(',')[0];
  const cellBeta = cells.split('-')[1].split(',')[1] == 'null' ? null : cells.split('-')[1].split(',')[1];
  const cellGamma = cells.split('-')[1].split(',')[2] == 'null' ? null : cells.split('-')[1].split(',')[2];
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
  };
}

export function parseTableData(data: (string | number | undefined)[][], crystals: Crystal[], proteins: Protein[], container: ShippingContainer) {
  return {
    ...container,
    sampleVOs: data.map((d) => parseSample(d, crystals, proteins, container.sampleVOs)).filter((s) => s != undefined),
  };
}

function parseSample(data: (string | number | undefined)[], crystals: Crystal[], proteins: Protein[], samples: ShippingSample[]) {
  const get = (index: number) => {
    if (data.length <= index) return undefined;
    return data[index];
  };

  if (
    data.filter((d) => {
      return d != null && d != undefined && d != '';
    }).length <= 1
  ) {
    return undefined;
  }

  const location = get(0);
  const sample_filter = samples.filter((s) => s.location == location);
  const sample = sample_filter.length ? { ...sample_filter[0] } : { diffractionPlanVO: {} };

  return {
    ...sample,
    location,
    name: get(2),
    code: get(3),
    smiles: get(14),
    comments: get(18),
    structureStage: get(19),
    crystalVO: parseCrystalInfo(data, crystals, proteins),
    diffractionPlanVO: {
      ...sample['diffractionPlanVO'],
      experimentKind: get(5),
      aimedResolution: get(6),
      requiredResolution: get(7),
      preferredBeamDiameter: get(8),
      numberOfPositions: get(9),
      aimedMultiplicity: get(10),
      aimedCompleteness: get(11),
      forcedSpaceGroup: get(12),
      radiationSensitivity: get(13),
      axisRange: get(15),
      minOscWidth: get(16),
      observedResolution: get(17),
    },
  };
}
