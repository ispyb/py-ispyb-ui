import type { Schema } from '@rest-hooks/rest';
import { createResource } from '@rest-hooks/rest';
import { EndpointExtraOptions } from 'rest-hooks';

import { AuthenticatedEndpoint } from './Authenticated';

export default function createPaginatedResource<
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
      schema: { results: [schema], total: 0, skip: 0, limit: 0 },
    }),
  };
}
