import { SiteResource } from './Base/Site';

export class LoginResource extends SiteResource {
  pk() {
    return '1';
  }

  static urlRoot = `auth/login`;
}
