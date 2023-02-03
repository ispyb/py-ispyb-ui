import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from './Base/Paginated';
import { withSample } from 'models/Sample';

export class SampleEntity extends Entity {
  readonly blSampleId: number;

  pk() {
    return this.blSampleId?.toString();
  }
}

export const SampleResource = createPaginatedResource({
  path: '/samples/:blSampleId',
  schema: withSample(SampleEntity),
});
