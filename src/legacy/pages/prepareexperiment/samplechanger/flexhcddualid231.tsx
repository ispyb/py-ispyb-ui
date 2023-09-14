import { containerType } from 'legacy/models';
import { AbstractFlexHCD } from './abstractflexhcd';

export class FlexHCDDualID231 extends AbstractFlexHCD {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  getContainerType(cell: number, position: number): containerType {
    const types: containerType[] = [
      'Spinepuck',
      'Unipuck',
      'Unipuck',
      'Unipuck',
      'Unipuck',
      'Unipuck',
      'Unipuck',
      'Unipuck',
    ];

    return types[cell];
  }
}