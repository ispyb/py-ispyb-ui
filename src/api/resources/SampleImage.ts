import PaginatedResource from 'api/resources/Base/Paginated';
import { withSampleImage } from 'models/SampleImage.d';

export class _SampleImageResource extends PaginatedResource {
  readonly blSampleImageId: number;

  pk() {
    return this.blSampleImageId?.toString();
  }

  static urlRoot = 'samples/images';
}

export const SampleImageResource = withSampleImage(_SampleImageResource);
