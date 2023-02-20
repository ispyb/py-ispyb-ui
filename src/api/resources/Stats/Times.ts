import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { TimesBase } from 'models/Times';

class TimesEntity extends TimesBase {
  readonly key: string;

  pk() {
    return this.key;
  }
}

export const TimesEndpoint = new AuthenticatedEndpoint({
  path: '/stats/times',
  schema: TimesEntity,
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
