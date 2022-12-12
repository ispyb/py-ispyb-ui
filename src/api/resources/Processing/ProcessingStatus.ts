import { AuthenticatedSingletonResource } from '../Base/Singleton';
import { withProcessingStatusesList } from 'models/ProcessingStatusesList.d';

class _ProcessingStatus extends AuthenticatedSingletonResource {
  static getEndpointExtra() {
    return {
      ...super.getEndpointExtra(),
      pollFrequency: 10000,
    };
  }

  static urlRoot = 'processings/status';
}

export const ProcessingStatus = withProcessingStatusesList(_ProcessingStatus);
