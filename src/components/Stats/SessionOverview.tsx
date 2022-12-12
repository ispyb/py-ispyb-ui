import { useSuspense } from 'rest-hooks';

import { BreakdownResource } from 'api/resources/Stats/Breakdown';
import { usePath } from 'hooks/usePath';
import { SessionResource } from 'api/resources/Session';

export default function SessionOverview() {
  const sessionId = usePath('sessionId');
  const breakdown = useSuspense(BreakdownResource.list(), { sessionId });
  const session = useSuspense(SessionResource.detail(), { sessionId });

  const { overview } = breakdown;
  return (
    <ul>
      <li>Start: {session.startDate}</li>
      <li>End: {session.endDate}</li>
      <li>Beamline: {session.beamLineName}</li>
      <li>Data Collections: {overview.counts.datacollections}</li>
    </ul>
  );
}
