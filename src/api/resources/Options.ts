import { AuthenticatedSingletonResource } from 'api/resources/Base/Singleton';
import { withOptions } from 'models/Options.d';

class _OptionsResource extends AuthenticatedSingletonResource {
  static urlRoot = 'options';
}

export const OptionsResource = withOptions(_OptionsResource);
