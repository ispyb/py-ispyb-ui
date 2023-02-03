import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from '../Base/Paginated';
import { withScreening } from 'models/Screening';

export class ScreeningEntity extends Entity {
  readonly screeningId: number;

  pk() {
    return this.screeningId?.toString();
  }
}

export const ScreeningResource = createPaginatedResource({
  path: '/processings/screenings/:screeningId',
  schema: withScreening(ScreeningEntity),
});
