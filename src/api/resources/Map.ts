import PaginatedResource from 'api/resources/Base/Paginated';
import { withMap } from 'models/Map.d';

export class _MapResource extends PaginatedResource {
  readonly xrfFluorescenceMappingId: number;

  pk() {
    return this.xrfFluorescenceMappingId?.toString();
  }

  static urlRoot = 'mapping';
}

export const MapResource = withMap(_MapResource);
