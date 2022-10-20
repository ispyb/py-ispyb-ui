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

export function getField(line: Line, field: FieldName): { index: number; value: Value } {
  const index = FIELDS.indexOf(field);
  if (line.length > index) return { index, value: line[index] };
  return { index, value: undefined };
}

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

  const getSampleKey = (protein?: Value, name?: Value) => {
    return `protein=${protein}+name=${name}`;
  };

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
      const sampleCode = sample.BLSample_name;
      return getSampleKey(protein, sampleCode);
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
