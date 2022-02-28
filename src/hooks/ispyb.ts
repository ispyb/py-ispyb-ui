import useSWR from 'swr';
import axios from 'axios';
import {
  getEMClassificationBy,
  getMXDataCollectionsBy,
  getEmMoviesByDataCollectionId,
  getProposal,
  getSessions,
  getSessionById,
  getEMDataCollectionsBy,
  getEMStatisticsBy,
  getMxDataCollectionsByGroupId,
  getMxWorkflow,
} from 'api/ispyb';
import { WorkflowStep } from 'pages/mx/model';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function doGet<T = any>(url: string, suspense = true) {
  const { data, error } = useSWR<T>(url, fetcher, { suspense: suspense });
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

interface ProposalSessionId {
  proposalName: string;
  sessionId?: string;
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

export function useEMDataCollectionsBy({ proposalName, sessionId }: ProposalSessionId) {
  return doGet(getEMDataCollectionsBy({ proposalName, sessionId }).url);
}

export function useMXDataCollectionsBy({ proposalName, sessionId }: ProposalSessionId) {
  return doGet(getMXDataCollectionsBy({ proposalName, sessionId }).url);
}
export function useMxDataCollectionsByGroupId({ proposalName, dataCollectionGroupId }: { proposalName: string; dataCollectionGroupId: string }) {
  return doGet(getMxDataCollectionsByGroupId({ proposalName, dataCollectionGroupId }).url);
}

export function useMxWorkflow({ proposalName, stepId }: { proposalName: string; stepId: string }) {
  return doGet<WorkflowStep>(getMxWorkflow({ proposalName, stepId }).url);
}

export function useEMStatistics({ proposalName, sessionId }: ProposalSessionId) {
  return doGet(getEMStatisticsBy({ proposalName, sessionId }).url);
}

export function useMoviesByDataCollectionId({ proposalName, dataCollectionId }: { proposalName: string; dataCollectionId: number }) {
  return doGet(getEmMoviesByDataCollectionId({ proposalName, dataCollectionId }).url);
}

export function useEMClassification({ proposalName, sessionId }: ProposalSessionId) {
  return doGet(getEMClassificationBy({ proposalName, sessionId }).url);
}
