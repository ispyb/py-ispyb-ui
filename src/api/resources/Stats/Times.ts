import {
  createAuthenticatedSingletonResource,
  SingletonEntity,
} from 'api/resources/Base/Singleton';
import { withTimes } from 'models/Times';

export const TimesResource = createAuthenticatedSingletonResource({
  path: '/stats/times/:dummy',
  schema: withTimes(SingletonEntity),
});
