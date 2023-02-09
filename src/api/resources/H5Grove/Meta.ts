import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { Entity } from '@rest-hooks/rest';

class H5MetaEntity extends Entity {
  readonly dataCollectionId: number;
  readonly path: string;
  readonly children: Record<string, any>[];

  pk() {
    return `${this.dataCollectionId}/${this.path}`;
  }
}

export const H5MetaEndpoint = new AuthenticatedEndpoint({
  path: '/data/h5grove/meta/',
  schema: H5MetaEntity,
  process(value, params) {
    value.dataCollectionId = params.dataCollectionId;
    value.path = params.path;
    return value;
  },
  searchParams: {} as {
    dataCollectionId: number;
    path: string;
  },
});
