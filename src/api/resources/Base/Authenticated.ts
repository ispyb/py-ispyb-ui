import type { Schema } from '@rest-hooks/rest';
import { createResource } from '@rest-hooks/rest';
import type { RestGenerics } from '@rest-hooks/rest';
import { SiteEndpoint } from './Site';

export class AuthenticatedEndpoint<
  O extends RestGenerics = any
> extends SiteEndpoint<O> {
  public static accessToken?: string;

  public getHeaders(headers: HeadersInit): HeadersInit {
    return {
      ...headers,
      Authorization: `Bearer ${AuthenticatedEndpoint.accessToken}`,
    };
  }
}

export function createAuthenticatedResource<
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
  return createResource({
    path,
    schema,
    Endpoint: AuthenticatedEndpoint,
    // ...endpointOptions
  });
}
