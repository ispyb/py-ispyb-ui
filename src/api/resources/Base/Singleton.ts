import { Resource } from '@rest-hooks/rest';
import { AuthenticatedResource } from './Authenticated';
import { SiteResource } from './Site';

export class SingletonResource extends SiteResource {
  pk() {
    return '1';
  }

  static url<T extends typeof Resource>(this: T): string {
    return `${SiteResource.baseUrl}/${this.urlRoot}`;
  }
}

export class AuthenticatedSingletonResource extends AuthenticatedResource {
  pk() {
    return '1';
  }

  static list<T extends typeof Resource>(this: T) {
    return super.list().extend({
      schema: this,
    });
  }

  static url<T extends typeof Resource>(this: T): string {
    return `${SiteResource.baseUrl}/${this.urlRoot}`;
  }
}
