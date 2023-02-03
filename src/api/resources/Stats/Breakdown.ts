import {
  createAuthenticatedSingletonResource,
  SingletonEntity,
} from 'api/resources/Base/Singleton';
import { withBreakdown } from 'models/Breakdown';

export const BreakdownResource = createAuthenticatedSingletonResource({
  path: '/stats/breakdown/:dummy',
  schema: withBreakdown(SingletonEntity),
});
