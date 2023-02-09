import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { Entity, createResource, RestGenerics } from '@rest-hooks/rest';

class MetaEndPoint<
  O extends RestGenerics = any
> extends AuthenticatedEndpoint<O> {
  // @ts-expect-error
  process(value, params) {
    value.dataCollectionId = params.dataCollectionId;
    value.path = params.path;
    return value;
  }
}

class H5MetaEntity extends Entity {
  readonly dataCollectionId: number;
  readonly path: string;
  readonly children: Record<string, any>[];

  pk() {
    return `${this.dataCollectionId}/${this.path}`;
  }
}

const H5MetaResourceBase = createResource({
  path: '/data/h5grove/meta/:dummy',
  schema: H5MetaEntity,
  // @ts-expect-error
  Endpoint: MetaEndPoint,
});

export const H5MetaResource = {
  ...H5MetaResourceBase,
  getList: H5MetaResourceBase.getList.extend({
    schema: H5MetaEntity,
  }),
};
