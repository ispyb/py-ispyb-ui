import { Resource } from '@rest-hooks/rest';

export abstract class SiteResource extends Resource {
  static baseUrl: string;

  static url<T extends typeof Resource>(this: T, params: any): string {
    return `${SiteResource.baseUrl}/${super.url(params)}`;
  }

  static listUrl<T extends typeof Resource>(this: T, params: any): string {
    return `${SiteResource.baseUrl}/${super.listUrl(params)}`;
  }
}
