import { createAuthenticatedSingletonResource } from 'api/resources/Base/Singleton';
import { ProcessingStatusesListSingletonBase } from 'models/ProcessingStatusesList';

export const ProcessingStatus = createAuthenticatedSingletonResource({
  path: '/processings/status/:dummy',
  schema: ProcessingStatusesListSingletonBase,
  endpointOptions: { pollFrequency: 10000 },
});
