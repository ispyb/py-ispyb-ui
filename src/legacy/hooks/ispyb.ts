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
  getProposalSamples,
} from 'legacy/api/ispyb';
import {
  EnergyScan,
  WorkflowStep,
  FluorescenceSpectra,
  Sample,
  DataCollectionGroup,
} from 'legacy/pages/mx/model';
import {
  Container,
  LabContact,
  Shipping,
  ShippingContainer,
  ShippingHistory,
} from 'legacy/pages/shipping/model';

import {
  ContainerDewar,
  Proposal,
  ProposalDetail,
  ProposalSample,
  Session,
} from 'legacy/pages/model';
import { dateToTimestamp } from 'legacy/helpers/dateparser';
import { parse } from 'date-fns';
import { useAuth } from 'hooks/useAuth';

interface GetHookOption {
  autoRefresh: boolean;
}
const defaultOptions: GetHookOption = {
  autoRefresh: true,
};

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-explicit-any
function useGet<T = any>(
  url: string,
  options: GetHookOption = defaultOptions,
  editData: (data: T) => T = (d) => d,
  suspense = true
) {
  const { site, token, clearToken } = useAuth();
  const fetcher = (url: string) =>
    axios
      .get(url)
      .catch((e) => {
        clearToken();
      })
      .then((res) => res?.data);

  const { data, error, mutate } = useSWR<T>(
    `${site.host}${site.apiPrefix}/${token}${url}`,
    fetcher,
    {
      suspense: suspense,
      revalidateIfStale: options.autoRefresh,
      revalidateOnFocus: options.autoRefresh,
      revalidateOnReconnect: options.autoRefresh,
    }
  );
  return {
    data: data === undefined ? undefined : editData(data),
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

interface ProposalSessionId {
  proposalName: string;
  sessionId?: string;
}

export function useProposal(
  { proposalName }: { proposalName: string },
  options?: GetHookOption
) {
  return useGet<ProposalDetail[]>(getProposal(proposalName).url, options);
}

export function useProposalSamples(
  { proposalName }: { proposalName: string },
  options?: GetHookOption
) {
  return useGet<ProposalSample[]>(
    getProposalSamples(proposalName).url,
    options
  );
}

export function useProposals(options?: GetHookOption) {
  return useGet<Proposal[]>(getProposals().url, options);
}

export function useSessions(
  props: {
    startDate?: string;
    endDate?: string;
    isManager?: boolean;
    proposalName?: string;
    username?: string;
  },
  options?: GetHookOption
) {
  const { startDate, endDate, isManager, proposalName } = props;
  let url: string = '';
  let sessionTransform: (sessions: any[]) => Session[] = (sessions) => sessions;
  if (proposalName) {
    if (startDate && endDate) {
      url = getProposalSessionsWhithDates(proposalName, startDate, endDate).url;
    } else {
      url = getProposalSessions(proposalName).url;
    }
  } else if (isManager) {
    if (startDate && endDate) {
      url = getSessionsManagerDates(startDate, endDate).url;
    }
  } else {
    if (startDate && endDate) {
      url = getSessions().url;
      sessionTransform = (sessions) => {
        return sessions.filter((s) => {
          const sessionStartTimeStamp = dateToTimestamp(s.BLSession_startDate);
          const sessionEndTimeStamp = dateToTimestamp(s.BLSession_endDate);
          const reqStart = parse(startDate, 'yyyyMMdd', new Date()).getTime();
          const reqEnd = parse(endDate, 'yyyyMMdd', new Date()).getTime();

          return (
            sessionStartTimeStamp <= reqEnd && sessionEndTimeStamp >= reqStart
          );
        });
      };
    }
    url = getSessions().url;
  }
  return useGet<Session[]>(url, options, sessionTransform);
}

export function useSession(
  { sessionId }: { sessionId: string },
  options?: GetHookOption
) {
  return useGet(getSessionById(sessionId).url, options);
}

export function useEMDataCollectionsBy(
  { proposalName, sessionId }: ProposalSessionId,
  options?: GetHookOption
) {
  return useGet(
    getEMDataCollectionsBy({ proposalName, sessionId }).url,
    options
  );
}

export function useMXDataCollectionsBy(
  { proposalName, sessionId }: ProposalSessionId,
  options?: GetHookOption
) {
  return useGet<DataCollectionGroup[]>(
    getMXDataCollectionsBy({ proposalName, sessionId }).url,
    options
  );
}
export function useMxDataCollectionsByGroupId(
  {
    proposalName,
    dataCollectionGroupId,
  }: { proposalName: string; dataCollectionGroupId: string },
  options?: GetHookOption
) {
  return useGet(
    getMxDataCollectionsByGroupId({ proposalName, dataCollectionGroupId }).url,
    options
  );
}

export function useMXEnergyScans(
  { proposalName, sessionId }: { proposalName: string; sessionId: string },
  options?: GetHookOption
) {
  return useGet<EnergyScan[]>(
    getMXEnergyScans({ proposalName, sessionId }).url,
    options
  );
}
export function useMXFluorescenceSpectras(
  { proposalName, sessionId }: { proposalName: string; sessionId: string },
  options?: GetHookOption
) {
  return useGet<FluorescenceSpectra[]>(
    getMXFluorescenceSpectras({ proposalName, sessionId }).url,
    options
  );
}

export function useMxWorkflow(
  { proposalName, stepId }: { proposalName: string; stepId: string },
  options?: GetHookOption
) {
  return useGet<WorkflowStep>(
    getMxWorkflow({ proposalName, stepId }).url,
    options
  );
}

export function useMXContainers(
  {
    proposalName,
    containerIds,
  }: { proposalName: string; containerIds: string[] },
  options?: GetHookOption
) {
  return useGet<Sample[]>(
    getMXContainers({ proposalName, containerIds }).url,
    options
  );
}

export function useEMStatistics(
  { proposalName, sessionId }: ProposalSessionId,
  options?: GetHookOption
) {
  return useGet(getEMStatisticsBy({ proposalName, sessionId }).url, options);
}

export function useMoviesByDataCollectionId(
  {
    proposalName,
    dataCollectionId,
  }: { proposalName: string; dataCollectionId: number },
  options?: GetHookOption
) {
  return useGet(
    getEmMoviesByDataCollectionId({ proposalName, dataCollectionId }).url,
    options
  );
}

export function useEMClassification(
  { proposalName, sessionId }: ProposalSessionId,
  options?: GetHookOption
) {
  return useGet(
    getEMClassificationBy({ proposalName, sessionId }).url,
    options
  );
}

export function useDewars(
  { proposalName }: { proposalName: string },
  options?: GetHookOption
) {
  return useGet<ContainerDewar[]>(getDewars({ proposalName }).url, options);
}

export function useXrfScanCsv(
  { scanId, proposalName }: { proposalName: string; scanId: number },
  options?: GetHookOption
) {
  return useGet<string>(getXrfScanCsv({ scanId, proposalName }).url, options);
}

export function useLabContacts(
  { proposalName }: { proposalName: string },
  options?: GetHookOption
) {
  return useGet<LabContact[]>(getLabContacts({ proposalName }).url, options);
}

export function useShipments(
  { proposalName }: { proposalName: string },
  options?: GetHookOption
) {
  return useGet<Container[]>(getShipments({ proposalName }).url, options);
}

export function useShipping(
  { proposalName, shippingId }: { proposalName: string; shippingId: number },
  options?: GetHookOption
) {
  return useGet<Shipping>(
    getShipping({ proposalName, shippingId }).url,
    options
  );
}

export function useShippingHistory(
  { proposalName, shippingId }: { proposalName: string; shippingId: number },
  options?: GetHookOption
) {
  return useGet<ShippingHistory>(
    getShippingHistory({ proposalName, shippingId }).url,
    options
  );
}

export function useShippingContainer(
  {
    proposalName,
    shippingId,
    dewarId,
    containerId,
  }: {
    proposalName: string;
    shippingId: string;
    dewarId: string;
    containerId: string;
  },
  options?: GetHookOption
) {
  return useGet<ShippingContainer>(
    getShippingContainer({ proposalName, shippingId, dewarId, containerId })
      .url,
    options
  );
}
