import createPaginatedResource from '../Base/Paginated';
import { ScreeningBase } from 'models/Screening';

export class ScreeningEntity extends ScreeningBase {
  readonly screeningId: number;

  pk() {
    return this.screeningId?.toString();
  }
}

export const ScreeningResource = createPaginatedResource({
  path: '/processings/screenings/:screeningId',
  schema: ScreeningEntity,
});
