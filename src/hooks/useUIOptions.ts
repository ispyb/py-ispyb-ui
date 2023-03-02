import { useSuspense } from 'rest-hooks';
import { UIOptionsEndpoint } from 'api/resources/UIOptions';

/**
 * Retrieve the UI Options
 * @returns
 */
export function useUIOptions() {
  return useSuspense(UIOptionsEndpoint);
}
