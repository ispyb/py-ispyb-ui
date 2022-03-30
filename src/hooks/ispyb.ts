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
  getProposalSessionsWhithDates,
  getSessionsManagerDates,
} from 'api/ispyb';
import { EnergyScan, WorkflowStep, FluorescenceSpectra, Sample, DataCollectionGroup } from 'pages/mx/model';

import { ContainerDewar, Proposal, Session } from 'pages/model';
import { dateToTimestamp } from 'helpers/dateparser';
import { parse } from 'date-fns';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-explicit-any
function doGet<T = any>(url: string, editData: (data: T) => T = (d) => d, suspense = true) {
  const { data, error, mutate } = useSWR<T>(url, fetcher, { suspense: suspense });
  return {
    data: data == undefined ? undefined : editData(data),
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

interface ProposalSessionId {
  proposalName: string;
  sessionId?: string;
}

export function useProposal({ proposalName }: { proposalName: string }) {
  return doGet(getProposal(proposalName).url);
}

export function useProposals() {
  return doGet<Proposal[]>(getProposals().url);
}

export function useSessions(props: { startDate?: string; endDate?: string; isManager?: boolean; proposalName?: string; username?: string }) {
  const { startDate, endDate, isManager, proposalName } = props;
  if (proposalName) {
    if (startDate && endDate) {
      return doGet<Session[]>(getProposalSessionsWhithDates(proposalName, startDate, endDate).url);
    }
    return doGet<Session[]>(getProposalSessions(proposalName).url);
  }
  if (isManager) {
    if (startDate && endDate) {
      return doGet<Session[]>(getSessionsManagerDates(startDate, endDate).url);
    } else {
      return { data: undefined, isError: 'Manager mush provide start and end dates' }; //would be too heavy
    }
  } else {
    if (startDate && endDate) {
      return doGet<Session[]>(getSessions().url, (sessions) => {
        return sessions.filter((s) => {
          const sessionStartTimeStamp = dateToTimestamp(s.BLSession_startDate);
          const sessionEndTimeStamp = dateToTimestamp(s.BLSession_endDate);
          const reqStart = parse(startDate, 'yyyyMMdd', new Date()).getTime();
          const reqEnd = parse(endDate, 'yyyyMMdd', new Date()).getTime();

          return sessionStartTimeStamp <= reqEnd && sessionEndTimeStamp >= reqStart;
        });
      });
    }
    return doGet<Session[]>(getSessions().url);
  }
}

export function useSession({ sessionId }: { sessionId: string }) {
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
