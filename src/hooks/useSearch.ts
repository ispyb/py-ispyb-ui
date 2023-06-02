import { usePersistentParamState } from './useParam';

/**
 * Get the query search parameter
 * @returns - the search parameter
 */
export function useSearch() {
  const [searchParam] = usePersistentParamState<string>('search', '');
  return searchParam;
}
