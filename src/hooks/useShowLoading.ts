import { useContext, useState, useEffect } from 'react';
import { IsLoadingContext } from 'isLoadingContext';

/**
 * A boolean describing whether a react transition is in progress
 * @param timeout - the timeout
 * @returns - whether the transition is still in progress
 */
export function useShowLoading(timeout: number = 100) {
  const isLoading = useContext(IsLoadingContext);
  const [sufficientTime, setSufficientTime] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      setSufficientTime(false);
      return;
    }
    const handle = setTimeout(() => setSufficientTime(true), timeout);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  return isLoading && sufficientTime;
}
