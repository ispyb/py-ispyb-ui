import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { Entity, createResource, RestGenerics } from '@rest-hooks/rest';

class DataEndPoint<
  O extends RestGenerics = any
> extends AuthenticatedEndpoint<O> {
  // @ts-expect-error
  process(value, params) {
    return {
      data: value,
      dataCollectionId: params.dataCollectionId,
      selection: params.selection,
      path: params.path,
    };
    
  }
}

class H5DataEntity extends Entity {
  readonly dataCollectionId: number;
  readonly path: string;
  readonly data: number[];
  readonly selection: any;

  pk() {
    return `${this.dataCollectionId}/${this.path}/${this.selection}`;
  }
}

const H5DataResourceBase = createResource({
  path: '/data/h5grove/data/:dummy',
  schema: H5DataEntity,
  // @ts-expect-error
  Endpoint: DataEndPoint,
});

export const H5DataResource = {
  ...H5DataResourceBase,
  getList: H5DataResourceBase.getList.extend({
    schema: H5DataEntity,
  }),
};
