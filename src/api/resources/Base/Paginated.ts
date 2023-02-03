import type { Schema } from '@rest-hooks/rest';
import { createResource } from '@rest-hooks/rest';

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
  readonly endpointOptions?: any;
}) {
  const BaseResource = createResource({
    path,
    schema,
    Endpoint: AuthenticatedEndpoint,
  });

  return {
    ...BaseResource,
    getList: BaseResource.getList.extend({
      schema: { results: [schema], total: 0, skip: 0, limit: 0 },
    }),
    // ...endpointOptions
  };
}
