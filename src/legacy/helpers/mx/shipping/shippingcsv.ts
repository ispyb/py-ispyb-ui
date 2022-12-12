import { containerCapacities } from 'legacy/constants/containers';
import _ from 'lodash';
import { ProposalDetail, ProposalSample } from 'legacy/pages/model';
import {
  Shipping,
  ShippingContainer,
  ShippingDewar,
  ShippingSample,
} from 'legacy/pages/shipping/model';
import { getContainerType } from '../samplehelper';

export const FIELDS = [
  'parcel name',
  'container name',
  'container type',
  'container position',
  'protein acronym',
  'sample acronym',
  'pin barcode',
  'SPG',
  'cellA',
  'cellB',
  'cellC',
  'cellAlpha',
  'cellBeta',
  'cellGamma',
  'experimentType',
  'aimed Resolution',
  'required Resolution',
  'beam diameter',
  'number of positions',
  'aimed multiplicity',
  'aimed completeness',
  'forced SPG',
  'radiation sensitivity',
  'smiles',
  'total rot. angle',
  'min osc. angle',
  'observed resolution',
  'comments',
] as const;
export type FieldName = typeof FIELDS[number];
export const MANDATORY_FIELDS: FieldName[] = [
  'parcel name',
  'container name',
  'container type',
  'container position',
  'protein acronym',
  'sample acronym',
];

export type Value = string | number | undefined;
export type Line = Value[];
export type Data = Line[];
export type Error = { row: number; col: number; message: string };
export type AutoReplacement = {
  row: number;
  col: number;
  oldValue: Value;
  newValue: Value;
};

export function getField(
  line: Line,
  field: FieldName
): { index: number; value: Value } {
  const index = FIELDS.indexOf(field);
  if (line.length > index) return { index, value: line[index] };
  return { index, value: undefined };
}
export function getFieldString(
  line: Line,
  field: FieldName
): { index: number; value: string | undefined } {
  const v = getField(line, field);

  return { ...v, value: v.value === undefined ? undefined : String(v.value) };
}
export function getFieldNumber(
  line: Line,
  field: FieldName
): { index: number; value: number | undefined } {
  const v = getField(line, field);
  return { ...v, value: v.value === undefined ? undefined : Number(v.value) };
}

const getSampleKey = (protein?: Value, name?: Value) => {
  return `protein=${protein}+name=${name}`;
};

export function validateShipping(
  data: Line[],
  shipping: Shipping,
  proposal: ProposalDetail,
  proposalSamples: ProposalSample[]
): Error[] {
  const errors: Error[] = [];

  // PREPARE DATA

  const parcelNames: Value[] = _(shipping.dewarVOs)
    .filter((s) => s.containerVOs.length > 0)
    .map((s) => s.code)
    .value();

  const shippingContainerNames: Value[] = _(shipping.dewarVOs)
    .flatMap((d) => d.containerVOs)
    .map((c) => c.code)
    .value();

  const shippingSampleKeys = _(data)
    .map((row) => {
      const protein = getField(row, 'protein acronym');
      const sample = getField(row, 'sample acronym');
      return getSampleKey(protein.value, sample.value);
    })
    .value();

  const shippingDuplicateSampleKeys = _(shippingSampleKeys)
    .filter((v, index) => shippingSampleKeys.indexOf(v) !== index)
    .uniq();

  const proposalSampleKeys = _(proposalSamples)
    .map((sample) => {
      const protein = sample.Protein_acronym;
      const sampleName = sample.BLSample_name;
      return getSampleKey(protein, sampleName);
    })
    .value();

  const proposalProteins = proposal.proteins.map((p) => p.acronym);

  // BUILD ERRORS

  data.forEach((row, rowIndex) => {
    MANDATORY_FIELDS.forEach((field) => {
      const fieldValue = getField(row, field);
      if (
        fieldValue.value === undefined ||
        String(fieldValue.value).trim().length === 0
      ) {
        errors.push({
          row: rowIndex,
          col: fieldValue.index,
          message: `Field '${field}' is mandatory.`,
        });
      }
    });

    const containerName = getField(row, 'container name');
    if (shippingContainerNames.includes(containerName.value)) {
      errors.push({
        row: rowIndex,
        col: containerName.index,
        message: `Container '${containerName.value}' already exists in this shipment.`,
      });
    }
    const parcelName = getField(row, 'parcel name');
    if (parcelNames.includes(parcelName.value)) {
      errors.push({
        row: rowIndex,
        col: parcelName.index,
        message: `Parcel '${parcelName.value}' already exists in this shipment.`,
      });
    }
    const protein = getField(row, 'protein acronym');
    const sample = getField(row, 'sample acronym');
    const sampleKey = getSampleKey(protein.value, sample.value);
    if (shippingDuplicateSampleKeys.includes(sampleKey)) {
      errors.push({
        row: rowIndex,
        col: sample.index,
        message: `Sample with key '${sampleKey}' is duplicate.`,
      });
    }
    if (proposalSampleKeys.includes(sampleKey)) {
      errors.push({
        row: rowIndex,
        col: sample.index,
        message: `Sample with key '${sampleKey}' already exists in proposal.`,
      });
    }
    if (sample.value && String(sample.value).match(/[^a-zA-Z0-9-_]/)) {
      const invalids = _([...String(sample.value).matchAll(/[^a-zA-Z0-9-_]/g)])
        .map((c) => c[0].replace(/\s/, 'space'))
        .uniq()
        .value();
      if (invalids.length === 1) {
        errors.push({
          row: rowIndex,
          col: sample.index,
          message: `Sample named '${sample.value}' has invalid character ${invalids[0]}`,
        });
      } else {
        errors.push({
          row: rowIndex,
          col: sample.index,
          message: `Sample named '${
            sample.value
          }' has invalid characters ${invalids.join(' ')}`,
        });
      }
    }
    if (protein.value && !proposalProteins.includes(String(protein.value))) {
      errors.push({
        row: rowIndex,
        col: protein.index,
        message: `Protein '${protein.value}' is not declared.`,
      });
    }
  });

  return errors;
}

export function autofixShipping(
  data: Line[],
  shipping: Shipping,
  proposalSamples: ProposalSample[]
): AutoReplacement[] {
  //PREPARE DATA

  const proposalSampleKeys = _(proposalSamples)
    .map((sample) => {
      const protein = sample.Protein_acronym;
      const sampleName = sample.BLSample_name;
      return getSampleKey(protein, sampleName);
    })
    .value();
  const shippingSampleKeys = _(data)
    .map((row) => {
      const protein = getField(row, 'protein acronym');
      const sample = getField(row, 'sample acronym');
      return getSampleKey(protein.value, sample.value);
    })
    .value();
  const existingSampleKeys = [...proposalSampleKeys, ...shippingSampleKeys];

  const sampleNameSuffixes: {
    [protein: string]: { [sampleName: string]: number };
  } = {};
  const getSampleNameWithSuffix = (
    protein: string,
    sampleName: string
  ): string => {
    if (!(protein in sampleNameSuffixes)) {
      sampleNameSuffixes[protein] = {};
    }
    const proteinDict = sampleNameSuffixes[protein];
    if (!(sampleName in proteinDict)) {
      proteinDict[sampleName] = 0;
      return sampleName;
    } else {
      proteinDict[sampleName] = proteinDict[sampleName] + 1;
      const newName = `${sampleName}-${proteinDict[sampleName]}`;
      const newKey = getSampleKey(protein, newName);
      if (!existingSampleKeys.includes(newKey)) {
        //We have a new key => use it
        existingSampleKeys.push(newKey);
        return newName;
      } else {
        //We created a key that already exist => try again with next iteration (suffix will be incremented)
        return getSampleNameWithSuffix(protein, sampleName);
      }
    }
  };
  //Initialize names with samples already in proposal
  proposalSamples.forEach((sample) => {
    const protein = sample.Protein_acronym;
    const sampleCode = sample.BLSample_name;
    getSampleNameWithSuffix(protein, sampleCode);
  });

  //Make fixes on data copy

  const replacements: AutoReplacement[] = [];

  data.forEach((line, row) => {
    const protein = getField(line, 'protein acronym');
    const sample = getField(line, 'sample acronym');

    //fix sample names
    if (protein.value !== undefined && sample.value !== undefined) {
      //Remove special characters
      const noSpecialCharacters = String(sample.value).replaceAll(
        /[^a-zA-Z0-9-_]/g,
        ''
      );
      //Remove duplicates
      const newName = getSampleNameWithSuffix(
        String(protein.value),
        noSpecialCharacters
      );
      if (String(sample.value) !== newName) {
        replacements.push({
          row,
          col: sample.index,
          oldValue: sample.value,
          newValue: newName,
        });
      }
    }
  });

  return replacements;
}

export function parseShippingCSV(
  data: Line[],
  proposal: ProposalDetail
): ShippingDewar[] {
  return _(data)
    .groupBy((line) => getField(line, 'parcel name').value)
    .map((parcelLines, parcelName): ShippingDewar => {
      return {
        code: parcelName,
        type: 'Dewar',
        containerVOs: _(parcelLines)
          .groupBy((line) => getField(line, 'container name').value)
          .map((containerLines, containerName): ShippingContainer => {
            const containerType = getContainerType(
              getFieldString(containerLines[0], 'container type').value
            );
            return {
              code: containerName,
              containerType: containerType,
              capacity: containerType ? containerCapacities[containerType] : 0,
              sampleVOs: _(containerLines)
                .map((sampleLine): ShippingSample => {
                  const proteinAcronym = getFieldString(
                    sampleLine,
                    'protein acronym'
                  ).value;
                  const protein = proposal.proteins.filter(
                    (p) =>
                      p.acronym !== undefined && p.acronym === proteinAcronym
                  )[0];
                  return {
                    name: getFieldString(sampleLine, 'sample acronym').value,
                    location: getFieldString(sampleLine, 'container position')
                      .value,
                    diffractionPlanVO: {
                      radiationSensitivity: getFieldNumber(
                        sampleLine,
                        'radiation sensitivity'
                      ).value,
                      aimedCompleteness: getFieldNumber(
                        sampleLine,
                        'aimed completeness'
                      ).value,
                      aimedMultiplicity: getFieldNumber(
                        sampleLine,
                        'aimed multiplicity'
                      ).value,
                      aimedResolution: getFieldNumber(
                        sampleLine,
                        'aimed Resolution'
                      ).value,
                      requiredResolution: getFieldNumber(
                        sampleLine,
                        'required Resolution'
                      ).value,
                      forcedSpaceGroup: getFieldString(sampleLine, 'forced SPG')
                        .value,
                      experimentKind: getFieldString(
                        sampleLine,
                        'experimentType'
                      ).value,
                      observedResolution: getFieldNumber(
                        sampleLine,
                        'observed resolution'
                      ).value,
                      preferredBeamDiameter: getFieldNumber(
                        sampleLine,
                        'beam diameter'
                      ).value,
                      numberOfPositions: getFieldNumber(
                        sampleLine,
                        'number of positions'
                      ).value,
                      axisRange: getFieldNumber(sampleLine, 'total rot. angle')
                        .value,
                      minOscWidth: getFieldNumber(sampleLine, 'min osc. angle')
                        .value,
                    },
                    crystalVO: {
                      spaceGroup: getFieldString(sampleLine, 'SPG').value,
                      cellA: getFieldNumber(sampleLine, 'cellA').value,
                      cellB: getFieldNumber(sampleLine, 'cellB').value,
                      cellC: getFieldNumber(sampleLine, 'cellC').value,
                      cellAlpha: getFieldNumber(sampleLine, 'cellAlpha').value,
                      cellBeta: getFieldNumber(sampleLine, 'cellBeta').value,
                      cellGamma: getFieldNumber(sampleLine, 'cellGamma').value,
                      proteinVO: protein,
                    },
                    smiles: getFieldString(sampleLine, 'smiles').value,
                    comments: getFieldString(sampleLine, 'comments').value,
                  };
                })
                .value(),
            };
          })
          .value(),
      };
    })
    .value();
}
