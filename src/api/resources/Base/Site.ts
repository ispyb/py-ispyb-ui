import type { RestGenerics } from '@rest-hooks/rest';
import { RestEndpoint } from '@rest-hooks/rest';

export class SiteEndpoint<
  O extends RestGenerics = any
> extends RestEndpoint<O> {
  public static baseUrl: string;

  public url(...args: any) {
    return SiteEndpoint.baseUrl + super.url(...args);
  }
}