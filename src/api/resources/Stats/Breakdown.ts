import { createAuthenticatedSingletonResource } from 'api/resources/Base/Singleton';
import { BreakdownSingletonBase } from 'models/Breakdown';

export const BreakdownResource = createAuthenticatedSingletonResource({
  path: '/stats/breakdown/:dummy',
  schema: BreakdownSingletonBase,
});
