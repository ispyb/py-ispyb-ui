import PaginatedResource from 'api/resources/Base/Paginated';
import { withSubSample } from 'models/SubSample.d';

export class _SubSampleResource extends PaginatedResource {
  readonly blSubSampleId: number;

  pk() {
    return this.blSubSampleId?.toString();
  }

  static urlRoot = 'samples/sub';
}

export const SubSampleResource = withSubSample(_SubSampleResource);
