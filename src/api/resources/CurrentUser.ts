import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { CurrentUserBase } from 'models/CurrentUser';

class CurrentUserEntity extends CurrentUserBase {
  readonly login: string;

  pk() {
    return this.login;
  }
}

export const CurrentUserEndpoint = new AuthenticatedEndpoint({
  path: '/user/current',
  schema: CurrentUserEntity,
});
