import PaginatedResource from 'api/resources/Base/Paginated';
import { withEventType } from 'models/EventType.d';

export class _EventTypeResource extends PaginatedResource {
  readonly eventType: string;

  pk() {
    return this.eventType;
  }
  static urlRoot = 'events/types';
}

export const EventTypeResource = withEventType(_EventTypeResource);
