import { SiteResource } from './Site';

export abstract class AuthenticatedResource extends SiteResource {
  static accessToken: string;
  static getFetchInit = (init: RequestInit): RequestInit => ({
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${this.accessToken}`,
    },
  });
}
