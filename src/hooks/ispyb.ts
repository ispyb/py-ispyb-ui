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
  getXrfScanCsv,
  getLabContacts,
  getShipments,
  getShipping,
  getShippingHistory,
  getShippingContainer,
} from 'api/ispyb';
import { EnergyScan, WorkflowStep, FluorescenceSpectra, Sample, DataCollectionGroup } from 'pages/mx/model';
import { Container, LabContact, Shipping, ShippingContainer, ShippingHistory } from 'pages/shipping/model';

import { ContainerDewar, Proposal, ProposalDetail, Session } from 'pages/model';
import { dateToTimestamp } from 'helpers/dateparser';
import { parse } from 'date-fns';
import { store } from 'store';
import { doLogOut } from 'redux/actions/user';

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    console.log(JSON.stringify(error));
    store.dispatch(doLogOut());
  }
);

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface GetHookOption {
  autoRefresh: boolean;
}
const defaultOptions: GetHookOption = {
  autoRefresh: true,
};

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-explicit-any
function doGet<T = any>(url: string, options: GetHookOption = defaultOptions, editData: (data: T) => T = (d) => d, suspense = true) {
  const { data, error, mutate } = useSWR<T>(url, fetcher, {
    suspense: suspense,
    revalidateIfStale: options.autoRefresh,
    revalidateOnFocus: options.autoRefresh,
    revalidateOnReconnect: options.autoRefresh,
  });
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

export function useProposal({ proposalName }: { proposalName: string }, options?: GetHookOption) {
  return doGet<ProposalDetail[]>(getProposal(proposalName).url, options);
}

export function useProposals(options?: GetHookOption) {
  return doGet<Proposal[]>(getProposals().url, options);
}

export function useSessions(props: { startDate?: string; endDate?: string; isManager?: boolean; proposalName?: string; username?: string }, options?: GetHookOption) {
  const { startDate, endDate, isManager, proposalName } = props;
  if (proposalName) {
    if (startDate && endDate) {
      return doGet<Session[]>(getProposalSessionsWhithDates(proposalName, startDate, endDate).url, options);
    }
    return doGet<Session[]>(getProposalSessions(proposalName).url, options);
  }
  if (isManager) {
    if (startDate && endDate) {
      return doGet<Session[]>(getSessionsManagerDates(startDate, endDate).url, options);
    } else {
      return { data: undefined, isError: 'Manager mush provide start and end dates' }; //would be too heavy
    }
  } else {
    if (startDate && endDate) {
      return doGet<Session[]>(getSessions().url, options, (sessions) => {
        return sessions.filter((s) => {
          const sessionStartTimeStamp = dateToTimestamp(s.BLSession_startDate);
          const sessionEndTimeStamp = dateToTimestamp(s.BLSession_endDate);
          const reqStart = parse(startDate, 'yyyyMMdd', new Date()).getTime();
          const reqEnd = parse(endDate, 'yyyyMMdd', new Date()).getTime();

          return sessionStartTimeStamp <= reqEnd && sessionEndTimeStamp >= reqStart;
        });
      });
    }
    return doGet<Session[]>(getSessions().url, options);
  }
}

export function useSession({ sessionId }: { sessionId: string }, options?: GetHookOption) {
  if (sessionId) {
    return doGet(getSessionById(sessionId).url, options);
  }
}

export function useEMDataCollectionsBy({ proposalName, sessionId }: ProposalSessionId, options?: GetHookOption) {
  return doGet(getEMDataCollectionsBy({ proposalName, sessionId }).url, options);
}

export function useMXDataCollectionsBy({ proposalName, sessionId }: ProposalSessionId, options?: GetHookOption) {
  return doGet<DataCollectionGroup[]>(getMXDataCollectionsBy({ proposalName, sessionId }).url, options);
}
export function useMxDataCollectionsByGroupId({ proposalName, dataCollectionGroupId }: { proposalName: string; dataCollectionGroupId: string }, options?: GetHookOption) {
  return doGet(getMxDataCollectionsByGroupId({ proposalName, dataCollectionGroupId }).url, options);
}

export function useMXEnergyScans({ proposalName, sessionId }: { proposalName: string; sessionId: string }, options?: GetHookOption) {
  return doGet<EnergyScan[]>(getMXEnergyScans({ proposalName, sessionId }).url, options);
}
export function useMXFluorescenceSpectras({ proposalName, sessionId }: { proposalName: string; sessionId: string }, options?: GetHookOption) {
  return doGet<FluorescenceSpectra[]>(getMXFluorescenceSpectras({ proposalName, sessionId }).url, options);
}

export function useMxWorkflow({ proposalName, stepId }: { proposalName: string; stepId: string }, options?: GetHookOption) {
  return doGet<WorkflowStep>(getMxWorkflow({ proposalName, stepId }).url, options);
}

export function useMXContainers({ proposalName, containerIds }: { proposalName: string; containerIds: string[] }, options?: GetHookOption) {
  return doGet<Sample[]>(getMXContainers({ proposalName, containerIds }).url, options);
}

export function useEMStatistics({ proposalName, sessionId }: ProposalSessionId, options?: GetHookOption) {
  return doGet(getEMStatisticsBy({ proposalName, sessionId }).url, options);
}

export function useMoviesByDataCollectionId({ proposalName, dataCollectionId }: { proposalName: string; dataCollectionId: number }, options?: GetHookOption) {
  return doGet(getEmMoviesByDataCollectionId({ proposalName, dataCollectionId }).url, options);
}

export function useEMClassification({ proposalName, sessionId }: ProposalSessionId, options?: GetHookOption) {
  return doGet(getEMClassificationBy({ proposalName, sessionId }).url, options);
}

export function useDewars({ proposalName }: { proposalName: string }, options?: GetHookOption) {
  return doGet<ContainerDewar[]>(getDewars({ proposalName }).url, options);
}

export function useXrfScanCsv({ scanId, proposalName }: { proposalName: string; scanId: number }, options?: GetHookOption) {
  return doGet<string>(getXrfScanCsv({ scanId, proposalName }).url, options);
}

export function useLabContacts({ proposalName }: { proposalName: string }, options?: GetHookOption) {
  return doGet<LabContact[]>(getLabContacts({ proposalName }).url, options);
}

export function useShipments({ proposalName }: { proposalName: string }, options?: GetHookOption) {
  return doGet<Container[]>(getShipments({ proposalName }).url, options);
}

export function useShipping({ proposalName, shippingId }: { proposalName: string; shippingId: number }, options?: GetHookOption) {
  return doGet<Shipping>(getShipping({ proposalName, shippingId }).url, options);
}

export function useShippingHistory({ proposalName, shippingId }: { proposalName: string; shippingId: number }, options?: GetHookOption) {
  return doGet<ShippingHistory>(getShippingHistory({ proposalName, shippingId }).url, options);
}

export function useShippingContainer(
  { proposalName, shippingId, dewarId, containerId }: { proposalName: string; shippingId: string; dewarId: string; containerId: string },
  options?: GetHookOption
) {
  return doGet<ShippingContainer>(getShippingContainer({ proposalName, shippingId, dewarId, containerId }).url, options);
}
