import PaginatedResource from 'api/resources/Base/Paginated';
import { withSession } from 'models/Session.d';
import { withSessionResponse } from 'models/SessionResponse.d';

export class _SessionResource extends PaginatedResource {
  readonly sessionId: number;

  pk() {
    return this.sessionId?.toString();
  }
  static urlRoot = 'sessions';
}

export const SessionResource = withSession(_SessionResource);

export class _SessionGroupResource extends _SessionResource {
  static urlRoot = 'sessions/group';
}

export const SessionGroupResource = withSession(_SessionGroupResource);

export class _Session2Resource extends PaginatedResource {
  readonly sessionId: number;

  pk() {
    return this.sessionId?.toString();
  }
  static urlRoot = 'session';
}

export const Session2Resource = withSessionResponse(_Session2Resource);
