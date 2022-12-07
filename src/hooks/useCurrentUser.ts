import { useSuspense } from 'rest-hooks';
import { CurrentUserResource } from 'api/resources/CurrentUser';

/**
 * Retrieve the current user
 * @returns
 */
export function useCurrentUser() {
  return useSuspense(CurrentUserResource.detail(), {});
}
