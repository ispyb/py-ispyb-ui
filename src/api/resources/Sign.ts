import { AuthenticatedSingletonResource } from './Base/Singleton';
import { withOneTimeToken } from 'models/OneTimeToken.d';

class _SignResource extends AuthenticatedSingletonResource {
  static urlRoot = 'user/sign';
}

export const SignResource = withOneTimeToken(_SignResource);
