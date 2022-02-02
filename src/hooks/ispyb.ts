import useSWR from 'swr';
import axios from 'axios';
import { getSessions, getSessionById, getDataCollectionsBy, getEMStatisticsBy } from 'api/ispyb';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

function doGet(url: string) {
  const { data, error } = useSWR(url, fetcher, { suspense: true });
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}

interface UseSession {
  startDate?: string;
  endDate?: string;
  sessionId?: string;
}
export function useSession(useSession: UseSession) {
  if (useSession.sessionId) return doGet(getSessionById(useSession.sessionId).url);
  return doGet(getSessions(useSession.startDate, useSession.endDate).url);
}
interface ProposalSessionId {
  proposalName: string;
  sessionId?: string;
}
export function useDataCollection({ proposalName, sessionId }: ProposalSessionId) {
  return doGet(getDataCollectionsBy({ proposalName, sessionId }).url);
}

export function useEMStatistics({ proposalName, sessionId }: ProposalSessionId) {
  return doGet(getEMStatisticsBy({ proposalName, sessionId }).url);
}
