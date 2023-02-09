import createPaginatedResource from './Base/Paginated';
import { EventTypeBase } from 'models/EventType';

export class EventTypeEntity extends EventTypeBase {
  readonly eventType: string;

  pk() {
    return this.eventType;
  }
}

export const EventTypeResource = createPaginatedResource({
  path: '/events/types/:eventType',
  schema: EventTypeEntity,
});
