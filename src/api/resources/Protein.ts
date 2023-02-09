import createPaginatedResource from './Base/Paginated';
import { ProteinBase } from 'models/Protein';

export class ProteinEntity extends ProteinBase {
  readonly proteinId: number;

  pk() {
    return this.proteinId?.toString();
  }
}

export const ProteinResource = createPaginatedResource({
  path: '/proteins/:proteinId',
  schema: ProteinEntity,
});
