import { useSuspense } from 'rest-hooks';
import { UIOptionsResource } from 'api/resources/UIOptions';

/**
 * Retrieve the UI Options
 * @returns
 */
export function useUIOptions() {
  return useSuspense(UIOptionsResource.detail(), {});
}
