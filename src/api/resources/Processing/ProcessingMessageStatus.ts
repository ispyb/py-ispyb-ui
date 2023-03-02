import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { AutoProcProgramMessageStatusesBase } from 'models/AutoProcProgramMessageStatuses';

class ProcessingMessageStatusEntity extends AutoProcProgramMessageStatusesBase {
  readonly key: string;

  pk() {
    return this.key;
  }
}

export const ProcessingMessageStatusEndpoint = new AuthenticatedEndpoint({
  path: '/processings/messages/status',
  schema: ProcessingMessageStatusEntity,
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
