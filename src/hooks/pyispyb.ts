import useSWR from 'swr';
import axios from 'axios';
import {
  RequestInformation,
  getDataCollectionGraphs,
  getDataCollectionGraphData,
  getSSXDataCollections,
  getSSXDataCollection,
  getSSXDataCollectionSample,
  getSession,
  getSSXDataCollectionSequences,
  getSSXDataCollectionHits,
  getSSXDataCollectionGroups,
  getSSXDataCollectionGroupSample,
  getSSXDataCollectionGroup,
  getEventsSession,
  getEventsDataCollectionGroup,
  getSample,
  getSSXDataCollectionProcessings,
} from 'api/pyispyb';
import { SSXDataCollectionResponse, SSXSampleResponse, SSXSequenceResponse, GraphResponse, GraphDataResponse, SSXHitsResponse, DataCollectionGroupResponse } from 'pages/ssx/model';
import { SessionResponse } from 'pages/model';
import { store } from 'store';
import { doLogOut } from 'redux/actions/user';
import { Event } from 'models/Event';
import { Sample } from 'models/Sample';
import { SSXDataCollectionProcessing } from 'models/SSXDataCollectionProcessing';

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

export function useSSXDataCollectionProcessings(params: { datacollectionIds: number[]; includeCells?: boolean }) {
  return doGet<SSXDataCollectionProcessing[]>(getSSXDataCollectionProcessings(params));
}
