import { createAuthenticatedSingletonResource } from 'api/resources/Base/Singleton';
import { OneTimeTokenSingletonBase } from 'models/OneTimeToken';

export const SignResource = createAuthenticatedSingletonResource({
  path: '/user/sign/:dummy',
  schema: OneTimeTokenSingletonBase,
});
