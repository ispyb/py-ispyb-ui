import { SiteEndpoint } from './Base/Site';
import { AuthConfigSingletonBase } from 'models/AuthConfig';

export const AuthConfigEndpoint = new SiteEndpoint({
  path: '/auth/config',
  schema: AuthConfigSingletonBase,
});
