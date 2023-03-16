import {
  ResultRankParam,
  ResultRankShell,
} from 'legacy/helpers/mx/results/resultparser';
import { useCallback, useMemo } from 'react';
import { usePersistentParamState } from './useParam';

export type PipelinesSelection = {
  pipelines: string[];
  setPipelines: (value: string[]) => void;
};
export function usePipelines(): PipelinesSelection {
  const [selectedPipelines, setSelectedPipelines] =
    usePersistentParamState<string>('pipelines', 'all');

  const pipelines = useMemo(() => {
    if (selectedPipelines !== 'all') {
      return selectedPipelines.split(',');
    }
    return [];
  }, [selectedPipelines]);

  const setPipelines = useCallback(
    (pipelines: string[]) => {
      setSelectedPipelines(pipelines.join(','));
    },
    [setSelectedPipelines]
  );

  return { pipelines, setPipelines };
}

export type AutoProcRankingSelection = {
  rankShell: ResultRankShell;
  rankParam: ResultRankParam;
  setRankShell: (value?: ResultRankShell) => void;
  setRankParam: (value?: ResultRankParam) => void;
};
export function useAutoProcRanking(): AutoProcRankingSelection {
  const [resultRankShell, setResultRankShell] =
    usePersistentParamState<ResultRankShell>('rankShell', 'Overall');
  const [resultRankParam, setResultRankParam] =
    usePersistentParamState<ResultRankParam>('rankParam', '<I/Sigma>');

  return {
    rankShell: resultRankShell,
    rankParam: resultRankParam,
    setRankShell: setResultRankShell,
    setRankParam: setResultRankParam,
  };
}
