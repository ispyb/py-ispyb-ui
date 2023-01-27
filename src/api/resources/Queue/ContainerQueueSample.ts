import PaginatedResource from 'api/resources/Base/Paginated';
import { withContainerQueueSample } from 'models/ContainerQueueSample.d';

export class _ContainerQueueSampleResource extends PaginatedResource {
  readonly containerQueueSampleId: number;

  pk() {
    return this.containerQueueSampleId?.toString();
  }

  static getEndpointExtra() {
    return {
      ...super.getEndpointExtra(),
      pollFrequency: 10000,
    };
  }

  static urlRoot = 'containers/queue/samples';
}

export const ContainerQueueSampleResource = withContainerQueueSample(_ContainerQueueSampleResource);
