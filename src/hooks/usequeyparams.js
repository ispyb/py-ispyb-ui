import { useLocation } from 'react-router';

/**
 * Used to get the query params.
 * Example: const { startDate = format(new Date(), 'yyyyMMdd'), endDate } = useQueryParams();
 * @returns
 */
export default function useQueryParams() {
  const dict = {};
  for (const [key, value] of new URLSearchParams(useLocation().search).entries()) {
    dict[key] = value;
  }
  return dict;
}

/**
 * Used to set query parameters
 * Example:
 *        query.set('page', data.selected + 1);
 *        history.push({ search: query.toString() });
 *
 * @returns
 */
export function useQuery() {
  return new URLSearchParams(useLocation().search);
}
