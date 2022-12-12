import { withEventChainResponse } from 'models/EventChainResponse.d';
import { AuthenticatedResource } from './Base/Authenticated';

class _EventChain extends AuthenticatedResource {
  readonly dataCollectionId: number;
  readonly eventChainId: number;

  pk() {
    return `${this.dataCollectionId}-${this.eventChainId}`;
  }

  static urlRoot = 'eventchain';
}

export const EventChainResource = withEventChainResponse(_EventChain);
