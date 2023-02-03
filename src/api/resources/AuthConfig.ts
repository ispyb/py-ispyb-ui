import { createSingletonResource, SingletonEntity } from 'api/resources/Base/Singleton';
import { withAuthConfig } from 'models/AuthConfig';

export const AuthConfigResource = createSingletonResource({
  path: '/auth/config/:dummy',
  schema: withAuthConfig(SingletonEntity),
});
