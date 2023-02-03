import {
  createAuthenticatedSingletonResource,
  SingletonEntity,
} from 'api/resources/Base/Singleton';
import { withErrors } from 'models/Errors';

export const ErrorsResource = createAuthenticatedSingletonResource({
  path: '/stats/errors/:dummy',
  schema: withErrors(SingletonEntity),
});
