import useSWR from 'swr';
import axios from 'axios';
import { getProposal, getSessions, getSessionById, getDataCollectionsBy, getEMStatisticsBy } from 'api/ispyb';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

function doGet(url: string, suspense = true) {
  const { data, error } = useSWR(url, fetcher, { suspense: suspense });
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
  isManager?: boolean;
  proposalName?: string;
  username?: string;
}

export function useProposal(props: UseSession) {
  return doGet(getProposal(props.username).url);
}

export function useSession(props: UseSession) {
  const { sessionId, startDate, endDate, isManager } = props;
  if (sessionId) {
    return doGet(getSessionById(sessionId).url);
  }
  if (isManager) {
    if (sessionId) return doGet(getSessionById(sessionId).url);
    return doGet(getSessions({ startDate, endDate }).url);
  }
  return doGet(getSessions({}).url);
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
