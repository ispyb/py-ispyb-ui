import { useSuspense } from 'rest-hooks';

import { TimesResource } from 'api/resources/Stats/Times';
import { usePath } from 'hooks/usePath';
import PlotEnhancer from './PlotEnhancer';

interface SeriesType {
  label: string;
  color: string;
}

export const series: Record<string, SeriesType> = {
  startup: { label: 'Startup', color: 'yellow' },
  datacollection: { label: 'Data Collection', color: 'green' },
  strategy: { label: 'Auto Indexing', color: '#93db70' },
  centring: { label: 'Centring', color: 'cyan' },
  edge: { label: 'Energy Scans', color: 'orange' },
  xrf: { label: 'XFE Spectra', color: 'orange' },
  robot: { label: 'Robot Actions', color: 'blue' },
  thinking: { label: 'Thinking', color: 'purple' },
  remaining: { label: 'Remaining', color: 'red' },
  fault: { label: 'Faults', color: 'grey' },
  beamloss: { label: 'Beam Dump', color: 'black' },
};

export default function TimesPie() {
  const sessionId = usePath('sessionId');
  const times = useSuspense(TimesResource.list(), { sessionId });
  const { duration, ...plottableTimes } = times.average;
  return (
    <>
      <PlotEnhancer
        data={[
          {
            values: Object.values(plottableTimes),
            labels: Object.keys(plottableTimes).map(
              (seriesName) => series[seriesName].label
            ),
            type: 'pie',
            textposition: 'inside',
            marker: {
              colors: Object.keys(plottableTimes).map(
                (seriesName) => series[seriesName].color
              ),
            },
          },
        ]}
        layout={{
          title: {
            text: 'Breakdown of Total Session Time',
            font: { size: 14 },
          },
        }}
      />
    </>
  );
}
