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
} from 'api/pyispyb';
import { SSXDataCollectionResponse, SSXSampleResponse, SSXSequenceResponse, GraphResponse, GraphDataResponse, SSXHitsResponse, DataCollectionGroupResponse } from 'pages/ssx/model';
import { SessionResponse } from 'pages/model';
import { store } from 'store';
import { doLogOut } from 'redux/actions/user';
import { Event } from 'models/Event';
import { Sample } from 'models/Sample';

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

export function useSSXDataCollections(sessionId: string, dataCollectionGroupId: string) {
  return doGet<SSXDataCollectionResponse[]>(getSSXDataCollections({ sessionId, dataCollectionGroupId }));
}

export function useSSXDataCollectionGroups(sessionId: string) {
  return doGet<DataCollectionGroupResponse[]>(getSSXDataCollectionGroups({ sessionId }));
}

export function useSSXDataCollectionGroup(dataCollectionGroupId: string) {
  return doGet<DataCollectionGroupResponse>(getSSXDataCollectionGroup({ dataCollectionGroupId }));
}

export function useSSXDataCollection(datacollectionId: number) {
  return doGet<SSXDataCollectionResponse>(getSSXDataCollection({ datacollectionId }));
}

export function useSSXDataCollectionSample(datacollectionId: number) {
  return doGet<SSXSampleResponse>(getSSXDataCollectionSample({ datacollectionId }));
}

export function useSSXDataCollectionGroupSample(datacollectiongroupId: number) {
  return doGet<SSXSampleResponse>(getSSXDataCollectionGroupSample({ datacollectiongroupId }));
}

export function useDataCollectionGraphs(datacollectionId: number) {
  return doGet<GraphResponse[]>(getDataCollectionGraphs({ datacollectionId }));
}

export function useDataCollectionGraphData(graphId: number) {
  return doGet<GraphDataResponse[]>(getDataCollectionGraphData({ graphId }));
}

export function useSSXDataCollectionSequences(datacollectionId: number) {
  return doGet<SSXSequenceResponse[]>(getSSXDataCollectionSequences({ datacollectionId }));
}

export function useSSXDataCollectionHits(datacollectionId: number) {
  return doGet<SSXHitsResponse>(getSSXDataCollectionHits({ datacollectionId }));
}

export function useSession(sessionId: string) {
  return doGet<SessionResponse>(getSession({ sessionId }));
}

interface Paginated<T> {
  results: [T];
  total: number;
  limit: number;
  skip: number;
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
