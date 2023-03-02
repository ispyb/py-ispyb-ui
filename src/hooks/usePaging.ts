import { useSearchParams } from 'react-router-dom';

/**
 * Get the query paging parameters
 * @param defaultSkip  - default skip (0)
 * @param defaultLimit - default limit (25)
 * @returns - the paging parameters
 */
export function usePaging(
  defaultLimit: number = 25,
  defaultSkip: number = 0,
  key?: string
) {
  const [searchParams] = useSearchParams();
  const skipParam = searchParams.get(key ? `skip-${key}` : 'skip');
  const skip = skipParam !== null ? parseInt(skipParam) : defaultSkip;
  const limitParam = searchParams.get(key ? `limit-${key}` : 'limit');
  const limit = limitParam !== null ? parseInt(limitParam) : defaultLimit;
  return {
    skip,
    limit,
  };
}
