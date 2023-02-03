import {
  createAuthenticatedSingletonResource,
  SingletonEntity,
} from 'api/resources/Base/Singleton';
import { withErrors } from 'models/Errors';

export const ErrorsResource = createAuthenticatedSingletonResource({
  path: '/stats/erorrs/:dummy',
  schema: withErrors(SingletonEntity),
});
