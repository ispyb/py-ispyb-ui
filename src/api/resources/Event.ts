import createPaginatedResource from './Base/Paginated';
import { EventBase } from 'models/Event';

export class EventEntity extends EventBase {
  readonly id: number;
  readonly type: string;

  pk() {
    return `${this.id}-${this.type}`;
  }
}

export const EventResource = createPaginatedResource({
  path: '/events/:id',
  schema: EventEntity,
  endpointOptions: { pollFrequency: 10000 },
});
