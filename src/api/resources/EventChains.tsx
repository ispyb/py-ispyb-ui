import { EventChainResponseBase } from 'models/EventChainResponse';
import { createAuthenticatedResource } from './Base/Authenticated';

export class EventChainEntity extends EventChainResponseBase {
  readonly dataCollectionId: number;
  readonly eventChainId: number;

  pk() {
    return `${this.dataCollectionId}-${this.eventChainId}`;
  }
}

export const EventChainResource = createAuthenticatedResource({
  path: '/eventchain/:eventChainId',
  schema: EventChainEntity,
});
