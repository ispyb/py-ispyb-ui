import { useSuspense } from 'rest-hooks';

import { TimesResource } from 'api/resources/Stats/Times';
import { usePath } from 'hooks/usePath';
import PlotEnhancer from './PlotEnhancer';
import { series } from './TimesPie';

export default function TimesBar() {
  const sessionId = usePath('sessionId');
  const times = useSuspense(TimesResource.list(), { sessionId });
  const { duration, ...plottableTimes } = times.average;
  return (
    <div style={{ height: '25px' }} className="text-right">
      <PlotEnhancer
        data={Object.entries(plottableTimes).map(([key, value]) => ({
          y: [1],
          x: [value],
          type: 'bar',
          name: series[key].label,
          orientation: 'h',
          marker: {
            color: series[key].color,
          },
        }))}
        layout={{
          barmode: 'stack',
          xaxis: {
            visible: false,
            zeroline: false,
          },
          yaxis: {
            visible: false,
            zeroline: false,
          },
          margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
          },
        }}
      />
    </div>
  );
}
