import { useSuspense } from 'rest-hooks';
import { CurrentUserEndpoint } from 'api/resources/CurrentUser';

/**
 * Retrieve the current user
 * @returns
 */
export function useCurrentUser() {
  return useSuspense(CurrentUserEndpoint);
}
