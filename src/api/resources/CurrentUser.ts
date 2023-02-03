import {
  createAuthenticatedSingletonResource,
  SingletonEntity,
} from './Base/Singleton';
import { withCurrentUser } from 'models/CurrentUser';

export const CurrentUserResource = createAuthenticatedSingletonResource({
  path: '/user/current/:dummy',
  schema: withCurrentUser(SingletonEntity),
  endpointOptions: { dataExpiryLength: 1000 },
});
