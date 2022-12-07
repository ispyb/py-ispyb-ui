import { AuthenticatedSingletonResource } from '../Base/Singleton';
import { withAutoProcProgramMessageStatuses } from 'models/AutoProcProgramMessageStatuses.d';

class _ProcessingMessageStatus extends AuthenticatedSingletonResource {
  static getEndpointExtra() {
    return {
      ...super.getEndpointExtra(),
      pollFrequency: 10000,
    };
  }

  static urlRoot = 'processings/messages/status';
}

export const ProcessingMessageStatus = withAutoProcProgramMessageStatuses(
  _ProcessingMessageStatus
);
