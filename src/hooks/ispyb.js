import useSWR from 'swr';
import axios from 'axios';
import { getSessions, getSessionById, getDataCollectionsBy } from 'api/ispyb';

const fetcher = (url) => axios.get(url).then((res) => res.data);

function doGet(url) {
  const { data, error } = useSWR(url, fetcher, { suspense: true });
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useSession({ startDate, endDate, sessionId }) {
  if (sessionId) return doGet(getSessionById(sessionId).url);
  return doGet(getSessions(startDate, endDate).url);
}

export function useDataCollection({ proposalName, sessionId }) {
  const { data, error } = doGet(getDataCollectionsBy(proposalName, sessionId).url);
  return { data, isLoading: !error && !data, isError: error };
}
