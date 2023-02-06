import { createAuthenticatedSingletonResource } from 'api/resources/Base/Singleton';
import { UIOptionsSingletonBase } from 'models/UIOptions';

export const UIOptionsResource = createAuthenticatedSingletonResource({
  path: '/options/ui/:dummy',
  schema: UIOptionsSingletonBase,
});
