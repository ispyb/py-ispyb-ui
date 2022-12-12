import { useParams } from 'react-router-dom';

/**
 * Get a path parameters
 * @param key - the parameter to retrieve
 * @returns - the parameter
 */
export function usePath(key: string): string | undefined {
  const params = useParams();
  return params[key];
}
