import { AuthenticatedResource } from 'api/resources/Base/Authenticated';
import { SiteResource } from 'api/resources/Base/Site';
import { Resource } from '@rest-hooks/rest';

export class H5MetaResource extends AuthenticatedResource {
  readonly dataCollectionId: number;
  readonly path: string;
  readonly children: Record<string, any>[];

  pk() {
    return `${this.dataCollectionId}/${this.path}`;
  }

  static list<T extends typeof Resource>(this: T) {
    return super.list().extend({
      schema: this,
      fetch: async (params: any) => {
        const response = await super.list().fetch(params);
        response.dataCollectionId = params.dataCollectionId;
        response.path = params.path;
        return response;
      },
    });
  }

  static url<T extends typeof Resource>(this: T): string {
    return `${SiteResource.baseUrl}/${this.urlRoot}`;
  }

  static urlRoot = 'data/h5grove/meta/';
}
