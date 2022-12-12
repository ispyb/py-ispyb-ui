import { useLocation } from 'react-router';

/**
 * Used to get the query params.
 * Example: const { startDate = format(new Date(), 'yyyyMMdd'), endDate } = useQueryParams();
 * @returns dictionary with URLSearchParams entries
 */
export default function useQueryParams(): Record<string, string> {
  const dict: Record<string, string> = {};
  const entries: IterableIterator<[string, string]> = new URLSearchParams(
    useLocation().search
  ).entries();

  for (const entry of Array.from(entries)) {
    dict[entry[0]] = entry[1];
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
