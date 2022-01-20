import useSWR from 'swr';
import axios from 'axios';
import { getSessions } from 'api/ispyb';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export function useSession(startDate, endDate) {
  const { data, error } = useSWR(getSessions(startDate, endDate).url, fetcher, { suspense: true });
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}
