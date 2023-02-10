import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { HourliesBase } from 'models/Hourlies';

class HourliesEntity extends HourliesBase {
  readonly key: string;

  pk() {
    return this.key;
  }
}

export const HourliesEndpoint = new AuthenticatedEndpoint({
  path: '/stats/hourlies',
  schema: HourliesEntity,
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
