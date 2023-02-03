import {
  createAuthenticatedSingletonResource,
  SingletonEntity,
} from 'api/resources/Base/Singleton';
import { withHourlies } from 'models/Hourlies';

export const HourliesResource = createAuthenticatedSingletonResource({
  path: '/stats/hourlies/:dummy',
  schema: withHourlies(SingletonEntity),
});
