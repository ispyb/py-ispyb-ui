import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from './Base/Paginated';
import { withSession } from 'models/Session';
import { withSessionResponse } from 'models/SessionResponse';

export class SessionEntity extends Entity {
  readonly sessionId: number;

  pk() {
    return this.sessionId?.toString();
  }
}

export const SessionResource = createPaginatedResource({
  path: '/sessions/:sessionId',
  schema: withSession(SessionEntity),
});

export const SessionGroupResource = createPaginatedResource({
  path: '/sessions/group/:sessionId',
  schema: withSession(SessionEntity),
});

export const Session2Resource = createPaginatedResource({
  path: '/session/:sessionId',
  schema: withSessionResponse(SessionEntity),
});
