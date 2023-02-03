import { JSONSchema7 } from 'json-schema';
import { createSingletonResource, SingletonEntity } from './Singleton';

// https://github.com/rjsf-team/react-jsonschema-form/issues/2006
// https://levelup.gitconnected.com/using-crud-operations-with-react-swr-for-mutating-rest-api-cache-3e0d01774aed

class OpenAPIEntity extends SingletonEntity {
  components: JSONSchema7 = {};
}

export const OpenAPIResource = createSingletonResource({
  path: '/openapi.json/:dummy',
  schema: OpenAPIEntity,
});
