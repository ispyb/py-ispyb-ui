import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { Entity } from '@rest-hooks/rest';

class H5DataEntity extends Entity {
  readonly dataCollectionId: number;
  readonly path: string;
  readonly data: number[];
  readonly selection: any;

  pk() {
    return `${this.dataCollectionId}/${this.path}/${this.selection}`;
  }
}

export const H5DataEndpoint = new AuthenticatedEndpoint({
  path: '/data/h5grove/data/',
  schema: H5DataEntity,
  process(value, params) {
    return {
      data: value,
      dataCollectionId: params.dataCollectionId,
      selection: params.selection,
      path: params.path,
    };
  },
  searchParams: {} as {
    dataCollectionId: number;
    path: string;
    selection?: number;
    flatten?: boolean;
  },
});
