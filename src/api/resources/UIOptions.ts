import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { UIOptionsSingletonBase } from 'models/UIOptions';

export const UIOptionsEndpoint = new AuthenticatedEndpoint({
  path: '/options/ui',
  schema: UIOptionsSingletonBase,
});
