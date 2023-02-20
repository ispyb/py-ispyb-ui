import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { BreakdownBase } from 'models/Breakdown';

class BreakdownEntity extends BreakdownBase {
  readonly key: string;

  pk() {
    return this.key;
  }
}

export const BreakdownEndpoint = new AuthenticatedEndpoint({
  path: '/stats/breakdown',
  schema: BreakdownEntity,
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
