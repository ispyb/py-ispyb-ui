import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { ProcessingStatusesListBase } from 'models/ProcessingStatusesList';

class ProcessingStatusEntity extends ProcessingStatusesListBase {
  readonly key: string;

  pk() {
    return this.key;
  }
}

export const ProcessingStatusEndpoint = new AuthenticatedEndpoint({
  path: '/processings/status',
  schema: ProcessingStatusEntity,
  process(value, params) {
    value.key = `dataCollectionIds:${JSON.parse(params.dataCollectionIds)
      .sort()
      .join(',')}`;
    return value;
  },
  searchParams: {} as {
    dataCollectionIds: string;
  },
  pollFrequency: 10000,
});
