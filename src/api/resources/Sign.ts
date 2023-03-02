import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { OneTimeTokenBase } from 'models/OneTimeToken';

class OneTimeTokenEntity extends OneTimeTokenBase {
  readonly validity: string;

  pk() {
    return this.validity;
  }
}

export const SignEndpoint = new AuthenticatedEndpoint({
  path: '/user/sign',
  schema: OneTimeTokenEntity,
  method: 'POST',
  dataExpiryLength: 10000,
});
