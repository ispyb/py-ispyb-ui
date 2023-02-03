import {
  createAuthenticatedSingletonResource,
  SingletonEntity,
} from 'api/resources/Base/Singleton';
import { withProcessingStatusesList } from 'models/ProcessingStatusesList';

export const ProcessingStatus = createAuthenticatedSingletonResource({
  path: '/processings/status/:dummy',
  schema: withProcessingStatusesList(SingletonEntity),
  endpointOptions: { pollFrequency: 10000 },
});
