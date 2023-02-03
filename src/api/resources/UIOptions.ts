import {
  createAuthenticatedSingletonResource,
  SingletonEntity,
} from 'api/resources/Base/Singleton';
import { withUIOptions } from 'models/UIOptions';

export const UIOptionsResource = createAuthenticatedSingletonResource({
  path: '/options/ui/:dummy',
  schema: withUIOptions(SingletonEntity),
});
