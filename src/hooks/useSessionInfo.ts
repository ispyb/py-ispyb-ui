import { useSuspense } from 'rest-hooks';

import { SessionResource } from 'api/resources/Session';
import { Session } from 'models/Session';

/**
 * Get the selected session info
 */
export function useSessionInfo(sessionId?: string): Session | undefined {
  return useSuspense(SessionResource.get, sessionId ? { sessionId } : null);
}
