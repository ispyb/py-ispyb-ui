import { createAuthenticatedSingletonResource } from 'api/resources/Base/Singleton';
import { HourliesSingletonBase } from 'models/Hourlies';

export const HourliesResource = createAuthenticatedSingletonResource({
  path: '/stats/hourlies/:dummy',
  schema: HourliesSingletonBase,
});
