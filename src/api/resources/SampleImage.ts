import createPaginatedResource from './Base/Paginated';

import { SampleImageBase } from 'models/SampleImage';

export class SampleImageEntity extends SampleImageBase {
  readonly blSampleImageId: number;

  pk() {
    return this.blSampleImageId?.toString();
  }
}

export const SampleImageResource = createPaginatedResource({
  path: '/samples/images/:blSampleImageId',
  schema: SampleImageEntity,
});
