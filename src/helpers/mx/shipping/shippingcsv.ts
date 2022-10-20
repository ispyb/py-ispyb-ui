import _ from 'lodash';
import { ProposalSample } from 'pages/model';
import { Shipping } from 'pages/shipping/model';

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
export const MANDATORY_FIELDS: FieldName[] = ['parcel name', 'container name', 'container type', 'container position', 'protein acronym', 'sample acronym'];

export type Value = string | number | undefined;
export type Line = Value[];
export type Data = Line[];
export type Error = { row: number; col: number; message: string };
export type AutoReplacement = { row: number; col: number; oldValue: Value; newValue: Value };

export function getField(line: Line, field: FieldName): { index: number; value: Value } {
  const index = FIELDS.indexOf(field);
  if (line.length > index) return { index, value: line[index] };
  return { index, value: undefined };
}

const getSampleKey = (protein?: Value, name?: Value) => {
  return `protein=${protein}+name=${name}`;
};

export function validateShipping(data: Line[], shipping: Shipping, proposalSamples: ProposalSample[]): Error[] {
  const errors: Error[] = [];

  // PREPARE DATA

  const parcelNames: Value[] = _(shipping.dewarVOs)
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
    .filter((v, index) => shippingSampleKeys.indexOf(v) != index)
    .uniq();

  const proposalSampleKeys = _(proposalSamples)
    .map((sample) => {
      const protein = sample.Protein_acronym;
      const sampleName = sample.BLSample_name;
      return getSampleKey(protein, sampleName);
    })
    .value();

  // BUILD ERRORS

  data.forEach((row, rowIndex) => {
    MANDATORY_FIELDS.forEach((field) => {
      const fieldValue = getField(row, field);
      if (fieldValue.value == undefined || String(fieldValue.value).trim().length == 0) {
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
      if (invalids.length == 1) {
        errors.push({
          row: rowIndex,
          col: sample.index,
          message: `Sample named '${sample.value}' has invalid character ${invalids[0]}`,
        });
      } else {
        errors.push({
          row: rowIndex,
          col: sample.index,
          message: `Sample named '${sample.value}' has invalid characters ${invalids.join(' ')}`,
        });
      }
    }
  });

  return errors;
}

export function autofixShipping(data: Line[], shipping: Shipping, proposalSamples: ProposalSample[]): [Line[], AutoReplacement[]] {
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

  const sampleNameSuffixes: { [protein: string]: { [sampleName: string]: number } } = {};
  const getSampleNameWithSuffix = (protein: string, sampleName: string): string => {
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

  const ndata: Line[] = JSON.parse(JSON.stringify(data));

  const replacements: AutoReplacement[] = [];

  ndata.forEach((line, row) => {
    const protein = getField(line, 'protein acronym');
    const sample = getField(line, 'sample acronym');

    //fix sample names
    if (protein.value != undefined && sample.value != undefined) {
      //Remove special characters
      const noSpecialCharacters = String(sample.value).replaceAll(/[^a-zA-Z0-9-_]/g, '');
      //Remove duplicates
      const newName = getSampleNameWithSuffix(String(protein.value), noSpecialCharacters);
      if (String(sample.value) != newName) {
        ndata[row][sample.index] = newName;
        replacements.push({
          row,
          col: sample.index,
          oldValue: sample.value,
          newValue: newName,
        });
      }
    }
  });

  return [ndata, replacements];
}
