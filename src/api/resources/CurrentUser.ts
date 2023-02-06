import { createAuthenticatedSingletonResource } from './Base/Singleton';
import { CurrentUserSingletonBase } from 'models/CurrentUser';

export const CurrentUserResource = createAuthenticatedSingletonResource({
  path: '/user/current/:dummy',
  schema: CurrentUserSingletonBase,
  endpointOptions: { dataExpiryLength: 1000 },
});
