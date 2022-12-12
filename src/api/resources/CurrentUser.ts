import { EndpointExtraOptions } from '@rest-hooks/rest';

import { AuthenticatedSingletonResource } from './Base/Singleton';
import { withCurrentUser } from 'models/CurrentUser.d';

class _CurrentUserResource extends AuthenticatedSingletonResource {
  static getEndpointExtra(): EndpointExtraOptions {
    return { dataExpiryLength: 1000 };
  }

  static urlRoot = 'user/current';
}

export const CurrentUserResource = withCurrentUser(_CurrentUserResource);
