import { Resource } from '@rest-hooks/rest';
import PaginatedResource from 'api/resources/Base/Paginated';
import { withSample } from 'models/Sample.d';

export class _SampleResource extends PaginatedResource {
  readonly blSampleId: number;

  pk() {
    return this.blSampleId?.toString();
  }

  static create<T extends typeof Resource>(this: T) {
    return super.create().extend({
      schema: { samples: [this] },
    });
  }

  static urlRoot = 'samples';
}

export const SampleResource = withSample(_SampleResource);
