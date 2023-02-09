import createPaginatedResource from './Base/Paginated';
import { MapBase } from 'models/Map';

export class MapEntity extends MapBase {
  readonly xrfFluorescenceMappingId: number;

  pk() {
    return this.xrfFluorescenceMappingId?.toString();
  }
}

export const MapResource = createPaginatedResource({
  path: '/mapping/:xrfFluorescenceMappingId',
  schema: MapEntity,
});
