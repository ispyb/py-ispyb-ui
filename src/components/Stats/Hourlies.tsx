import { useSuspense } from 'rest-hooks';

import { HourliesEndpoint } from 'api/resources/Stats/Hourlies';
import { usePath } from 'hooks/usePath';
import PlotEnhancer from './PlotEnhancer';

export default function Hourlies() {
  const sessionId = usePath('sessionId');
  const hourlies = useSuspense(HourliesEndpoint, {
    ...(sessionId ? { sessionId } : null),
  });
  return (
    <>
      <PlotEnhancer
        data={[
          {
            x: hourlies.datacollections.hour,
            y: hourlies.datacollections.average,
            type: 'bar',
          },
        ]}
        layout={{
          title: {
            text: 'Data Collections / Hour',
            font: { size: 14 },
          },
          bargap: 0.1,
          xaxis: {
            title: 'Hour',
          },
          yaxis: {
            title: 'Average',
          },
        }}
      />
    </>
  );
}
