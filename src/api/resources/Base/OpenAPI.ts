import { JSONSchema7 } from 'json-schema';
import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { SingletonEntity } from './Singleton';

// https://github.com/rjsf-team/react-jsonschema-form/issues/2006
// https://levelup.gitconnected.com/using-crud-operations-with-react-swr-for-mutating-rest-api-cache-3e0d01774aed

class OpenAPIEntity extends SingletonEntity {
  components: JSONSchema7 = {};
}

export const OpenAPIEndpoint = new AuthenticatedEndpoint({
  path: '/openapi.json',
  schema: OpenAPIEntity,
});
