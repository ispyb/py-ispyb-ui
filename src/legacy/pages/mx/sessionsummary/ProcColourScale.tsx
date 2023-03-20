import { useAutoProcRanking } from 'hooks/mx';
import { usePersistentParamState } from 'hooks/useParam';
import {
  AutoProcIntegration,
  compareRankingValues,
  getRankingOrder,
  getRankingValue,
  ResultRankParam,
  ResultRankShell,
} from 'legacy/helpers/mx/results/resultparser';
import { useEffect, useState } from 'react';

function valuesWithoutUndefineds(values: (number | undefined)[]) {
  return values.filter((v) => v !== undefined) as number[];
}

const DEFAULTS_SCALE: Record<
  ResultRankParam,
  Record<ResultRankShell, Record<'worst' | 'best', number | undefined>>
> = {
  Rmerge: {
    Inner: { worst: 15, best: 5 },
    Outer: { worst: 50, best: 30 },
    Overall: { worst: 15, best: 10 },
  },
  '<I/Sigma>': {
    Inner: { worst: 5, best: 10 },
    Outer: { worst: 0.5, best: 1.5 },
    Overall: { worst: 5, best: 10 },
  },
  'cc(1/2)': {
    Inner: { worst: 0.9, best: 0.99 },
    Outer: { worst: 0.1, best: 0.4 },
    Overall: { worst: 0.9, best: 0.95 },
  },
  ccAno: {
    Inner: { worst: 30, best: 80 },
    Outer: { worst: 0, best: 10 },
    Overall: { worst: 0, best: 30 },
  },
};

function getDefaultSaved(
  shell: ResultRankShell,
  param: ResultRankParam,
  type: 'best' | 'worst',
  refId?: number
) {
  const key = `${shell}-${param}-${type}-${refId}`;
  const value = sessionStorage.getItem(key);
  if (value) {
    return Number(value);
  }
  return undefined;
}

function saveDefault(
  shell: ResultRankShell,
  param: ResultRankParam,
  type: 'best' | 'worst',
  value: number,
  refId?: number
) {
  const currentDefault = getDefaultSaved(shell, param, type);
  const key = `${shell}-${param}-${type}-${refId}`;
  if (currentDefault !== value) {
    sessionStorage.setItem(key, value.toFixed(2));
  }
  if (DEFAULTS_SCALE[param][shell][type] === value) {
    sessionStorage.removeItem(key);
  }
}

function clearSaveDefault(
  shell: ResultRankShell,
  param: ResultRankParam,
  type: 'best' | 'worst',
  refId?: number
) {
  const key = `${shell}-${param}-${type}-${refId}`;
  sessionStorage.removeItem(key);
}

export type ProcColorScaleInformation = {
  best: number;
  worst: number;
  scaleWorst: number;
  scaleBest: number;
  setScaleWorst: (value: number) => void;
  setScaleBest: (value: number) => void;
  getColor: (
    value: number,
    worstOverride?: number,
    bestOverride?: number,
    forScale?: boolean
  ) => string;
  ranking: ReturnType<typeof useAutoProcRanking>;
  resetScale: () => void;
};

export function useProcColorScale(
  rankedIntegrations: AutoProcIntegration[]
): ProcColorScaleInformation {
  const ranking = useAutoProcRanking();

  const refId = rankedIntegrations[0]?.id;

  const values = valuesWithoutUndefineds(
    rankedIntegrations.map((r) =>
      getRankingValue(r, ranking.rankShell, ranking.rankParam)
    )
  );

  const sortedValues = values.sort((a, b) =>
    compareRankingValues(a, b, ranking.rankParam)
  );

  const best = sortedValues[0] || 0;
  const worst = sortedValues[sortedValues.length - 1] || 0;

  const getDefault = (type: 'best' | 'worst') => {
    let defaultValue =
      DEFAULTS_SCALE[ranking.rankParam][ranking.rankShell][type];
    const saved = getDefaultSaved(
      ranking.rankShell,
      ranking.rankParam,
      type,
      refId
    );
    if (saved !== undefined) {
      defaultValue = saved;
    }
    const value = type === 'best' ? best : worst;

    if (defaultValue === undefined) {
      return value;
    }

    const sorted = [defaultValue, value].sort((a, b) =>
      compareRankingValues(a, b, ranking.rankParam)
    );
    return sorted[type === 'best' ? 1 : 0];
  };

  const defaultScaleBest = getDefault('best');
  const defaultScaleWorst = getDefault('worst');

  const [scaleBest, setScaleBest] = usePersistentParamState<string>(
    'scaleBest',
    defaultScaleBest.toString()
  );

  const [scaleWorst, setScaleWorst] = usePersistentParamState<string>(
    'scaleWorst',
    defaultScaleWorst.toString()
  );

  const [rankingParamsKey, setRankingParamsKey] = useState(
    `${ranking.rankParam}-${ranking.rankShell}`
  );

  useEffect(() => {
    const newRankingParamsKey = `${ranking.rankParam}-${ranking.rankShell}`;
    if (rankingParamsKey !== newRankingParamsKey) {
      setScaleBest(defaultScaleBest.toString());
      setScaleWorst(defaultScaleWorst.toString());
      setRankingParamsKey(newRankingParamsKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ranking.rankParam, ranking.rankShell]);

  const resetScale = () => {
    clearSaveDefault(ranking.rankShell, ranking.rankParam, 'best', refId);
    clearSaveDefault(ranking.rankShell, ranking.rankParam, 'worst', refId);

    setScaleBest(getDefault('best').toString());
    setScaleWorst(getDefault('worst').toString());
  };

  return {
    best,
    worst,
    scaleWorst: Number(scaleWorst),
    scaleBest: Number(scaleBest),
    setScaleWorst: (value: number) => {
      saveDefault(ranking.rankShell, ranking.rankParam, 'worst', value, refId);
      setScaleWorst(value.toFixed(2));
    },
    setScaleBest: (value: number) => {
      saveDefault(ranking.rankShell, ranking.rankParam, 'best', value, refId);
      setScaleBest(value.toFixed(2));
    },
    ranking,
    resetScale,
    getColor: (
      value: number,
      worstOverride?: number,
      bestOverride?: number,
      forScale?: boolean
    ) => {
      const worst = worstOverride ?? Number(scaleWorst);
      const best = bestOverride ?? Number(scaleBest);
      const order = getRankingOrder(ranking.rankParam);
      const min = order === 1 ? best : worst;
      const max = order === 1 ? worst : best;
      const minColor =
        order === 1
          ? { red: 0, green: 255, blue: 0 }
          : { red: 255, green: 0, blue: 0 };
      const maxColor =
        order === 1
          ? { red: 255, green: 0, blue: 0 }
          : { red: 0, green: 255, blue: 0 };

      const yellow = { red: 255, green: 255, blue: 0 };

      const color = ColourGradient(min, max, value, minColor, yellow, maxColor);

      if (forScale && (value <= min || value >= max)) {
        const add = 200;
        return `rgba(${safeColorValue(color.red + add)},${safeColorValue(
          color.green + add
        )},${safeColorValue(color.blue + add)})`;
      }

      return `rgb(${color.red},${color.green},${color.blue})`;
    },
  };
}

export function percentToScaleValue(
  percent: number,
  scale: ProcColorScaleInformation
) {
  const range = scale.best - scale.worst;
  const value = scale.worst + range * (percent / 100);
  return value;
}

export function scaleValueToPercent(
  value: number,
  scale: ProcColorScaleInformation
) {
  const range = scale.best - scale.worst;
  const percent = ((value - scale.worst) / range) * 100;
  return percent;
}

function safeColorValue(value: number) {
  if (value > 255) return 255;
  if (value < 0) return 0;
  return value;
}

export interface Colour {
  red: number;
  blue: number;
  green: number;
}

/** Calculates an intermediary colour between 2 or 3 colours.
 * @returns {Colour} Object with red, green, and blue number fields.
 * @example -> {red: 123, blue: 255, green: 0}
 */
export default function ColourGradient(
  min: number,
  max: number,
  current: number,
  colorA: Colour,
  colorB: Colour,
  colorC?: Colour
): Colour {
  let color_progression;
  if (current >= max) color_progression = 1;
  else color_progression = (current - min) / (max - min); // Standardize as decimal [0-1 (inc)].
  if (colorC) {
    color_progression *= 2;
    if (color_progression >= 1) {
      color_progression -= 1;
      colorA = colorB;
      colorB = colorC;
    }
  }

  const newRed = colorA.red + color_progression * (colorB.red - colorA.red);
  const newGreen =
    colorA.green + color_progression * (colorB.green - colorA.green);
  const newBlue = colorA.blue + color_progression * (colorB.blue - colorA.blue);

  const red = safeColorValue(Math.floor(newRed));
  const green = safeColorValue(Math.floor(newGreen));
  const blue = safeColorValue(Math.floor(newBlue));

  return { red, green, blue };
}
