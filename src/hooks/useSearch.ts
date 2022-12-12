import { useSearchParams } from 'react-router-dom';

/**
 * Get the query search parameter
 * @returns - the search parameter
 */
export function useSearch() {
  const [searchParams] = useSearchParams();
  return searchParams.get('search');
}
