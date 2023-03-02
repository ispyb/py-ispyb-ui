import createPaginatedResource from './Base/Paginated';
import { SessionBase } from 'models/Session';
import { SessionResponseBase } from 'models/SessionResponse';

export class SessionEntity extends SessionBase {
  readonly sessionId: number;

  pk() {
    return this.sessionId?.toString();
  }
}

export const SessionResource = createPaginatedResource({
  path: '/sessions/:sessionId',
  schema: SessionEntity,
});

export const SessionGroupResource = createPaginatedResource({
  path: '/sessions/group/:sessionId',
  schema: SessionEntity,
});

export class SessionResponseEntity extends SessionResponseBase {
  readonly sessionId: number;

  pk() {
    return this.sessionId?.toString();
  }
}

export const Session2Resource = createPaginatedResource({
  path: '/session/:sessionId',
  schema: SessionResponseEntity,
});
