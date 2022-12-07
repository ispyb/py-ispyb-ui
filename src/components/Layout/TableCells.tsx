import EnumBadge from 'components/Common/EnumBadge';
import { get } from 'lodash';

import { round } from 'utils/numbers';
import { IResults, IColumn } from './Table';

export function toPrecision(precision: number) {
  return function (row: IResults, column: IColumn) {
    const value = get(row, column.key);
    return round(value, precision);
  };
}

export function enumBadge(row: IResults, column: IColumn) {
  return (
    <EnumBadge
      value={get(row, column.key)}
      colorEnum={column.formatterParams?.enum}
    />
  );
}
