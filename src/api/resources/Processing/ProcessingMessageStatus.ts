import {
  createAuthenticatedSingletonResource,
  SingletonEntity,
} from 'api/resources/Base/Singleton';
import { withAutoProcProgramMessageStatuses } from 'models/AutoProcProgramMessageStatuses';

export const ProcessingMessageStatus = createAuthenticatedSingletonResource({
  path: '/processings/messages/status/:dummy',
  schema: withAutoProcProgramMessageStatuses(SingletonEntity),
  endpointOptions: { pollFrequency: 10000 },
});
