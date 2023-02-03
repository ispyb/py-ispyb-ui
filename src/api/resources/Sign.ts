import {
  createAuthenticatedSingletonResource,
  SingletonEntity,
} from 'api/resources/Base/Singleton';
import { withOneTimeToken } from 'models/OneTimeToken';

export const SignResource = createAuthenticatedSingletonResource({
  path: '/user/sign/:dummy',
  schema: withOneTimeToken(SingletonEntity),
});
