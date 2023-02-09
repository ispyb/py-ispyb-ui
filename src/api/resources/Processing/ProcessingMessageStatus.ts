import { createAuthenticatedSingletonResource } from 'api/resources/Base/Singleton';
import { AutoProcProgramMessageStatusesSingletonBase } from 'models/AutoProcProgramMessageStatuses';

export const ProcessingMessageStatus = createAuthenticatedSingletonResource({
  path: '/processings/messages/status/:dummy',
  schema: AutoProcProgramMessageStatusesSingletonBase,
  endpointOptions: { pollFrequency: 10000 },
});
