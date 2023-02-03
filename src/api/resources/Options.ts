import {
  createAuthenticatedSingletonResource,
  SingletonEntity,
} from 'api/resources/Base/Singleton';
import { withOptions } from 'models/Options';

export const OptionsResource = createAuthenticatedSingletonResource({
  path: '/options/:dummy',
  schema: withOptions(SingletonEntity),
});
