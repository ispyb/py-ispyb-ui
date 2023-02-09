import createPaginatedResource from '../Base/Paginated';
import { ContainerQueueSampleBase } from 'models/ContainerQueueSample';

export class ContainerQueueSampleEntity extends ContainerQueueSampleBase {
  readonly containerQueueSampleId: number;

  pk() {
    return this.containerQueueSampleId?.toString();
  }
}

export const ContainerQueueSampleResource = createPaginatedResource({
  path: '/containers/queue/samples/:containerQueueSampleId',
  schema: ContainerQueueSampleEntity,
  endpointOptions: { pollFrequency: 10000 },
});
