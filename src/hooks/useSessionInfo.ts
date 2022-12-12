import { useSuspense } from 'rest-hooks';

import { SessionResource } from 'api/resources/Session';
import { Session } from 'models/Session.d';

/**
 * Get the selected session info
 */
export function useSessionInfo(sessionId?: string): Session {
  return useSuspense(
    SessionResource.detail(),
    sessionId ? { sessionId } : null
  );
}
