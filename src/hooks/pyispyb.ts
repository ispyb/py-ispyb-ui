import useSWR from 'swr';
import axios from 'axios';
import { RequestInformation, getSSXDataCollections, getSSXDataCollection, getSSXDataCollectionSample, getSession, getSSXDataCollectionSequences } from 'api/pyispyb';
import { SSXDataCollectionResponse, SSXSampleResponse, SSXSequenceResponse } from 'pages/ssx/model';
import { SessionResponse } from 'pages/model';

const fetcher = (url: string, token: string) =>
  axios
    .get(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);

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

export function useSSXDataCollections(sessionId: string) {
  return doGet<SSXDataCollectionResponse[]>(getSSXDataCollections({ sessionId }));
}

export function useSSXDataCollection(datacollectionId: number) {
  return doGet<SSXDataCollectionResponse>(getSSXDataCollection({ datacollectionId }));
}

export function useSSXDataCollectionSample(datacollectionId: number) {
  return doGet<SSXSampleResponse>(getSSXDataCollectionSample({ datacollectionId }));
}

export function useSSXDataCollectionSequences(datacollectionId: number) {
  return doGet<SSXSequenceResponse[]>(getSSXDataCollectionSequences({ datacollectionId }));
}

export function useSession(sessionId: string) {
  return doGet<SessionResponse>(getSession({ sessionId }));
}
