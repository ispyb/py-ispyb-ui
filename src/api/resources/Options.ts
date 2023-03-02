import { createAuthenticatedSingletonResource } from 'api/resources/Base/Singleton';
import { OptionsSingletonBase } from 'models/Options';

export const OptionsResource = createAuthenticatedSingletonResource({
  path: '/options',
  schema: OptionsSingletonBase,
});
