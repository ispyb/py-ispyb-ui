import useSWR from 'swr';
import axios from 'axios';
import {
  getMXDataCollectionsBy,
  getProposalSessions,
  getEMClassificationBy,
  getEmMoviesByDataCollectionId,
  getProposal,
  getSessions,
  getSessionById,
  getEMDataCollectionsBy,
  getMxDataCollectionsByGroupId,
  getMxWorkflow,
  getProposals,
  getEMStatisticsBy,
  getMXContainers,
  getMXEnergyScans,
  getMXFluorescenceSpectras,
  getDewars,
} from 'api/ispyb';
import { EnergyScan, WorkflowStep, FluorescenceSpectra, Sample, DataCollectionGroup } from 'pages/mx/model';

import { ContainerDewar, Proposal } from 'pages/model';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function doGet<T = any>(url: string, suspense = true) {
  const { data, error, mutate } = useSWR<T>(url, fetcher, { suspense: suspense });
  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate,
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
  return doGet(getProposal(props.proposalName).url);
}

export function useProposals() {
  return doGet<Proposal[]>(getProposals().url);
}

export function useSessions(props: UseSession) {
  const { startDate, endDate, isManager, proposalName, username } = props;
  if (proposalName) {
    return doGet(getProposalSessions(proposalName).url);
  }
  if (!isManager && username) {
    return doGet(getProposalSessions(username).url);
  }
  if (isManager && (!startDate || !endDate)) {
    return { data: undefined, isError: 'Manager mush provide start and end dates' }; //would be too heavy
  }
  return doGet(getSessions({ startDate, endDate }).url);
}

export function useSession(props: UseSession) {
  const { sessionId } = props;
  if (sessionId) {
    return doGet(getSessionById(sessionId).url);
  }
}

export function useEMDataCollectionsBy({ proposalName, sessionId }: ProposalSessionId) {
  return doGet(getEMDataCollectionsBy({ proposalName, sessionId }).url);
}

export function useMXDataCollectionsBy({ proposalName, sessionId }: ProposalSessionId) {
  return doGet<DataCollectionGroup[]>(getMXDataCollectionsBy({ proposalName, sessionId }).url);
}
export function useMxDataCollectionsByGroupId({ proposalName, dataCollectionGroupId }: { proposalName: string; dataCollectionGroupId: string }) {
  return doGet(getMxDataCollectionsByGroupId({ proposalName, dataCollectionGroupId }).url);
}

export function useMXEnergyScans({ proposalName, sessionId }: { proposalName: string; sessionId: string }) {
  return doGet<EnergyScan[]>(getMXEnergyScans({ proposalName, sessionId }).url);
}
export function useMXFluorescenceSpectras({ proposalName, sessionId }: { proposalName: string; sessionId: string }) {
  return doGet<FluorescenceSpectra[]>(getMXFluorescenceSpectras({ proposalName, sessionId }).url);
}

export function useMxWorkflow({ proposalName, stepId }: { proposalName: string; stepId: string }) {
  return doGet<WorkflowStep>(getMxWorkflow({ proposalName, stepId }).url);
}

export function useMXContainers({ proposalName, containerIds }: { proposalName: string; containerIds: string[] }) {
  return doGet<Sample[]>(getMXContainers({ proposalName, containerIds }).url);
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

export function useDewars({ proposalName }: { proposalName: string }) {
  return doGet<ContainerDewar[]>(getDewars({ proposalName }).url);
}
