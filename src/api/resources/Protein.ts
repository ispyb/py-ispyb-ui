import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from './Base/Paginated';
import { withProtein } from 'models/Protein';

export class ProteinEntity extends Entity {
  readonly proteinId: number;

  pk() {
    return this.proteinId?.toString();
  }
}

export const ProteinResource = createPaginatedResource({
  path: '/proteins/:proteinId',
  schema: withProtein(ProteinEntity),
});
