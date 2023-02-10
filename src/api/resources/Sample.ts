import createPaginatedResource from './Base/Paginated';
import { SampleBase } from 'models/Sample';

export class SampleEntity extends SampleBase {
  readonly blSampleId: number;

  pk() {
    return this.blSampleId?.toString();
  }
}

export const SampleResource = createPaginatedResource({
  path: '/samples/:blSampleId',
  schema: SampleEntity,
});
