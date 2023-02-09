import createPaginatedResource from './Base/Paginated';
import { SubSampleBase } from 'models/SubSample';

export class SubSampleEntity extends SubSampleBase {
  readonly blSubSampleId: number;

  pk() {
    return this.blSubSampleId?.toString();
  }
}

export const SubSampleResource = createPaginatedResource({
  path: '/samples/sub/:blSubSampleId',
  schema: SubSampleEntity,
});
