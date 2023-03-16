import { useAutoProcRanking } from 'hooks/mx';
import { usePersistentParamState } from 'hooks/useParam';
import {
  AutoProcIntegration,
  compareRankingValues,
  getRankingOrder,
  getRankingValue,
} from 'legacy/helpers/mx/results/resultparser';
import { useEffect } from 'react';

function valuesWithoutUndefineds(values: (number | undefined)[]) {
  return values.filter((v) => v !== undefined) as number[];
}

export type ProcCoulorScaleInformation = {
  best: number;
  worst: number;
  scaleWorst: number;
  scaleBest: number;
  setScaleWorst: (value: number) => void;
  setScaleBest: (value: number) => void;
  getColor: (value: number) => string;
  ranking: ReturnType<typeof useAutoProcRanking>;
};

export function useProcColorScale(
  rankedIntegrations: AutoProcIntegration[]
): ProcCoulorScaleInformation {
  const ranking = useAutoProcRanking();

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

  const [scaleBest, setScaleBest] = usePersistentParamState<string>(
    'scaleBest',
    best.toString()
  );

  const [scaleWorst, setScaleWorst] = usePersistentParamState<string>(
    'scaleWorst',
    worst.toString()
  );

  useEffect(() => {
    setScaleBest(best.toString());
    setScaleWorst(worst.toString());
  }, [
    best,
    ranking.rankParam,
    ranking.rankShell,
    setScaleBest,
    setScaleWorst,
    worst,
  ]);

  const actualScaleBest = [best, Number(scaleBest)].sort((a, b) =>
    compareRankingValues(a, b, ranking.rankParam)
  )[1];
  const actualScaleWorst = [worst, Number(scaleWorst)].sort((a, b) =>
    compareRankingValues(a, b, ranking.rankParam)
  )[0];

  return {
    best,
    worst,
    scaleWorst: actualScaleWorst,
    scaleBest: actualScaleBest,
    setScaleWorst: (value: number) => setScaleWorst(value.toFixed(2)),
    setScaleBest: (value: number) => setScaleBest(value.toFixed(2)),
    ranking,
    getColor: (value: number) => {
      const order = getRankingOrder(ranking.rankParam);
      const min = order === 1 ? actualScaleBest : actualScaleWorst;
      const max = order === 1 ? actualScaleWorst : actualScaleBest;
      const minColor =
        order === 1
          ? { red: 0, green: 255, blue: 0 }
          : { red: 255, green: 0, blue: 0 };
      const maxColor =
        order === 1
          ? { red: 255, green: 0, blue: 0 }
          : { red: 0, green: 255, blue: 0 };

      const color = ColourGradient(min, max, value, minColor, maxColor);
      return `rgb(${color.red},${color.green},${color.blue})`;
    },
  };
}

export function percentToScaleValue(
  percent: number,
  scale: ProcCoulorScaleInformation
) {
  const range = scale.best - scale.worst;
  const value = scale.worst + range * (percent / 100);
  //   console.log(value);
  return value;
}

export function scaleValueToPercent(
  value: number,
  scale: ProcCoulorScaleInformation
) {
  const range = scale.best - scale.worst;
  const percent = ((value - scale.worst) / range) * 100;
  return percent;
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

  const red = Math.floor(newRed);
  const green = Math.floor(newGreen);
  const blue = Math.floor(newBlue);

  return { red, green, blue };
}
