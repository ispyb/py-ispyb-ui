import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { ErrorsBase } from 'models/Errors';

class ErrorsEntity extends ErrorsBase {
  readonly key: string;

  pk() {
    return this.key;
  }
}

export const ErrorsEndpoint = new AuthenticatedEndpoint({
  path: '/stats/errors',
  schema: ErrorsEntity,
  process(value, params) {
    value.key = params.sessionId
      ? `sessionId:${params.sessionId}`
      : `runId:${params.runId}/${params.beamLineName}`;
    return value;
  },
  searchParams: {} as {
    beamLineName?: string;
    runId?: string;
    sessionId?: string;
  },
});
