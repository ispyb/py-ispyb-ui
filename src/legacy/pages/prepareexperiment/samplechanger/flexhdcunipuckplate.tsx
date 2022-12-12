import { containerType } from 'legacy/models';
import { AbstractFlexHCD } from './abstractflexhcd';

export class FlexHCDUnipuckPlate extends AbstractFlexHCD {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  getContainerType(cell: number, position: number): containerType {
    return 'Unipuck';
  }
}
