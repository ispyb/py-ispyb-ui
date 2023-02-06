import { createAuthenticatedSingletonResource } from 'api/resources/Base/Singleton';
import { ErrorsSingletonBase } from 'models/Errors';

export const ErrorsResource = createAuthenticatedSingletonResource({
  path: '/stats/errors/:dummy',
  schema: ErrorsSingletonBase,
});
