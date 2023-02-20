import { useSuspense } from 'rest-hooks';
import { OpenAPIEndpoint } from 'api/resources/Base/OpenAPI';

/**
 * Get the OpenAPI spec from the server
 * @returns - the OpenAPI resource
 */
export function useSpec() {
  return useSuspense(OpenAPIEndpoint);
}

/**
 * Get a specific schema from the OpenAPI spec
 * @param schema - the schema to get
 * @param title - a title to give the schema
 * @returns - the schema
 */
export function useSchema(schema: string, title: string) {
  const spec = useSpec();
  return {
    $ref: `#/components/schemas/${schema}`,
    components: {
      ...spec.components,
    },
    title: title,
  };
}
