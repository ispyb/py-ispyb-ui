import { Entity } from '@rest-hooks/rest';
import { withEventChainResponse } from 'models/EventChainResponse';
import { createAuthenticatedResource } from './Base/Authenticated';

export class EventChainEntity extends Entity {
  readonly dataCollectionId: number;
  readonly eventChainId: number;

  pk() {
    return `${this.dataCollectionId}-${this.eventChainId}`;
  }
}

export const EventChainResource = createAuthenticatedResource({
  path: '/eventchain/:eventChainId',
  schema: withEventChainResponse(EventChainEntity),
});
