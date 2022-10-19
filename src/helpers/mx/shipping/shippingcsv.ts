import _ from 'lodash';
import { ProposalSample } from 'pages/model';

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

export type Value = string | number | undefined;
export type Line = Value[];
export type Data = Line[];
export type Error = { row: number; col: number; message: string };

export function getField(line: Line, field: FieldName): { index: number; value: Value } {
  const index = FIELDS.indexOf(field);
  if (line.length > index) return { index, value: line[index] };
  return { index, value: undefined };
}

export function validateShipping(data: Line[], proposalSamples: ProposalSample[]): Error[] {
  const errors: Error[] = [];
  const parcelNames: Value[] = _(proposalSamples)
    .map((s) => s.Dewar_code)
    .uniq()
    .value();

  data.forEach((row, rowIndex) => {
    const parcelName = getField(row, 'parcel name');
    if (parcelNames.includes(parcelName.value)) {
      errors.push({
        row: rowIndex,
        col: parcelName.index,
        message: `Parcel ${parcelName.value} already exists`,
      });
    }
  });

  return errors;
}
