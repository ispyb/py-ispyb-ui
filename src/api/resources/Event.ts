import PaginatedResource from 'api/resources/Base/Paginated';
import { withEvent } from 'models/Event.d';

export class _EventResource extends PaginatedResource {
  readonly id: number;
  readonly type: string;

  pk() {
    return `${this.id}-${this.type}`;
  }
  static urlRoot = 'events';

  static getEndpointExtra() {
    return {
      ...super.getEndpointExtra(),
      pollFrequency: 10000,
    };
  }
}

export const EventResource = withEvent(_EventResource);
