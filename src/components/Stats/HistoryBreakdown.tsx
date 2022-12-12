import { useSuspense } from 'rest-hooks';

import { BreakdownResource } from 'api/resources/Stats/Breakdown';
import { usePath } from 'hooks/usePath';
import PlotEnhancer from './PlotEnhancer';
// import { DateTime } from 'luxon';
import { getColors } from '../../utils/colours';

export default function HistoryBreakdown() {
  const sessionId = usePath('sessionId');
  const breakdown = useSuspense(BreakdownResource.list(), { sessionId });
  // const types = Array.from(
  //   new Set(breakdown.history.map((obj) => obj.eventType))
  // );
  const proteins = Array.from(
    new Set(
      breakdown.history
        .filter((item) => item.protein)
        .map((item) => item.protein)
    )
  );
  const colours = getColors(proteins.length);
  const proteinColours = Object.fromEntries(
    proteins.map((protein, id) => [protein, colours[id]])
  );
  return (
    <PlotEnhancer
      data={breakdown.history.map((item) => ({
        y: [item.eventType, item.eventType],
        x: [item.startTime, item.endTime],
        text: item.subType,
        mode: 'lines',
        line: {
          width: 30,
          color: item.protein && proteinColours[item.protein],
        },
      }))}
      layout={{
        yaxis: {
          //   visible: false,
          zeroline: false,
          //   range: [0.999, 1.001],
        },
      }}
    />
  );
}
