import { createSingletonResource } from 'api/resources/Base/Singleton';
import { AuthConfigSingletonBase } from 'models/AuthConfig';

export const AuthConfigResource = createSingletonResource({
  path: '/auth/config/:dummy',
  schema: AuthConfigSingletonBase,
});
