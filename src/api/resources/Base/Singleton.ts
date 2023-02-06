import { Entity, Schema } from '@rest-hooks/rest';
import { createResource } from '@rest-hooks/rest';
import { EndpointExtraOptions } from 'rest-hooks';

import { AuthenticatedEndpoint } from './Authenticated';
import { SiteEndpoint } from './Site';

export function createSingletonResource<U extends string, S extends Schema>({
  path,
  schema,
}: {
  readonly path: U;
  readonly schema: S;
}) {
  const BaseResource = createResource({
    path,
    schema,
    Endpoint: SiteEndpoint,
  });

  return {
    ...BaseResource,
    getList: BaseResource.getList.extend({
      schema,
    }),
  };
}

export function createAuthenticatedSingletonResource<
  U extends string,
  S extends Schema
>({
  path,
  schema,
  endpointOptions,
}: {
  readonly path: U;
  readonly schema: S;
  readonly endpointOptions?: EndpointExtraOptions;
}) {
  const BaseResource = createResource({
    path,
    schema,
    Endpoint: AuthenticatedEndpoint,
    ...endpointOptions,
  });

  return {
    ...BaseResource,
    getList: BaseResource.getList.extend({
      schema,
    }),
  };
}

export class SingletonEntity extends Entity {
  pk() {
    return '1';
  }
}
