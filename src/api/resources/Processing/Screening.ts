import PaginatedResource from 'api/resources/Base/Paginated';
import { withScreening } from 'models/Screening.d';

export class _ScreeningResource extends PaginatedResource {
  readonly screeningId: number;

  pk() {
    return this.screeningId?.toString();
  }
  static urlRoot = 'processings/screenings';
}

export const ScreeningResource = withScreening(_ScreeningResource);
