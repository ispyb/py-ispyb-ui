import { AuthenticatedSingletonResource } from '../Base/Singleton';
import { withErrors } from 'models/Errors.d';

class _ErrorsResource extends AuthenticatedSingletonResource {
  static urlRoot = 'stats/errors';
}

export const ErrorsResource = withErrors(_ErrorsResource);
