import useSWR from 'swr';
import axios from 'axios';
import { getSessions } from 'api/ispyb';

const fetcher = (url) => axios.get(url).then((res) => res.data);

function doGet(url) {
  const { data, error } = useSWR(url, fetcher, { suspense: true });
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useSession(startDate, endDate) {
  const { data, error } = doGet(getSessions(startDate, endDate).url);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}
