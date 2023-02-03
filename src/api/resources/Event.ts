import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from './Base/Paginated';
import { withEvent } from 'models/Event';

export class EventEntity extends Entity {
  readonly id: number;
  readonly type: string;

  pk() {
    return `${this.id}-${this.type}`;
  }
}

export const EventResource = createPaginatedResource({
  path: '/events/:id',
  schema: withEvent(EventEntity),
  endpointOptions: { pollFrequency: 1000 },
});
