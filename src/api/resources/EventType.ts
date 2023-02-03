import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from './Base/Paginated';
import { withEventType } from 'models/EventType';

export class EventTypeEntity extends Entity {
  readonly eventType: string;

  pk() {
    return this.eventType;
  }
}

export const EventTypeResource = createPaginatedResource({
  path: '/events/types/:eventType',
  schema: withEventType(EventTypeEntity),
});
