import useSWR from 'swr';
import axios from 'axios';
import {
  RequestInformation,
  getSession,
  getSSXDataCollectionSequences,
  getEventsSession,
  getEventsDataCollectionGroup,
  getSample,
  getSSXDataCollectionProcessingStats,
  getSSXDataCollectionProcessingCells,
  getEventChains,
  getSSXDataCollectionProcessingCellsHistogram,
} from 'api/pyispyb';
import { SSXSequenceResponse } from 'pages/ssx/model';
import { SessionResponse } from 'pages/model';
import { store } from 'store';
import { doLogOut } from 'redux/actions/user';
import { Event } from 'models/Event';
import { Sample } from 'models/Sample';
import { SSXDataCollectionProcessingStats } from 'models/SSXDataCollectionProcessingStats';
import { SSXDataCollectionProcessingCells } from 'models/SSXDataCollectionProcessingCells';
import { EventChainResponse } from 'models/EventChainResponse';
import { SSXDataCollectionProcessingCellsHistogram } from 'models/SSXDataCollectionProcessingCellsHistogram';

const fetcher = (url: string, token: string) =>
  axios
    .get(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status == 401) {
        store.dispatch(doLogOut());
      }
      throw error;
    })
    .then((res) => (res ? res.data : undefined));

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-explicit-any
function doGet<T = any>(info: RequestInformation, editData: (data: T) => T = (d) => d, suspense = true) {
  const { data, error, mutate } = useSWR<T>([info.url, info.token], fetcher, { suspense: suspense });
  return {
    data: data == undefined ? undefined : editData(data),
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
interface Paginated<T> {
  results: [T];
  total: number;
  limit: number;
  skip: number;
}

export function useSSXDataCollectionSequences(datacollectionId: number) {
  return doGet<SSXSequenceResponse[]>(getSSXDataCollectionSequences({ datacollectionId }));
}

export function useSession(sessionId: string) {
  return doGet<SessionResponse>(getSession({ sessionId }));
}

export function useEventsSession(params: { sessionId: number; proposal: string }) {
  return doGet<Paginated<Event>>(getEventsSession(params));
}

export function useEventsDataCollectionGroup(params: { dataCollectionGroupId: number }) {
  return doGet<Paginated<Event>>(getEventsDataCollectionGroup(params));
}

export function useSample(params: { blSampleId: number }) {
  return doGet<Sample>(getSample(params));
}

export function useSSXDataCollectionProcessingStats(params: { datacollectionIds: number[] }) {
  return doGet<SSXDataCollectionProcessingStats[]>(getSSXDataCollectionProcessingStats(params));
}

export function useSSXDataCollectionProcessingCells(params: { datacollectionId: number }) {
  return doGet<SSXDataCollectionProcessingCells>(getSSXDataCollectionProcessingCells(params));
}

export function useSSXDataCollectionProcessingCellsHistogram(params: { datacollectionId: number }) {
  return doGet<SSXDataCollectionProcessingCellsHistogram>(getSSXDataCollectionProcessingCellsHistogram(params));
}

export function useEventChains(params: { datacollectionId: number }) {
  return doGet<EventChainResponse[]>(getEventChains(params));
}
