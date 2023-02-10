import { createAuthenticatedSingletonResource } from 'api/resources/Base/Singleton';
import { TimesSingletonBase } from 'models/Times';

export const TimesResource = createAuthenticatedSingletonResource({
  path: '/stats/times/:dummy',
  schema: TimesSingletonBase,
});
