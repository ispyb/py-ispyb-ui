import { Suspense } from 'react';
import { useSuspense, useSubscription } from 'rest-hooks';
import { DateTime } from 'luxon';
import { useInView } from 'react-intersection-observer';

import { PerImageAnalysisResource } from 'api/resources/PerImageAnalysis';
import { PerImageAnalysis as PerImageAnalysisType } from 'models/PerImageAnalysis.d';
import PlotEnhancer from 'components/Stats/PlotEnhancer';
import Loading from '../Loading';

interface IPerImageAnalysis {
  dataCollectionId: number;
  endTime?: string;
  refresh?: boolean;
}

function PerImageAnalysisMain({
  dataCollectionId,
  endTime,
  refresh = true,
}: IPerImageAnalysis) {
  const opts = {
    limit: 500,
    dataCollectionId,
  };
  const age =
    endTime && DateTime.now().diff(DateTime.fromISO(endTime), ['minutes']);
  const doRefresh = age && age.minutes < 15 && refresh;
  const perImageAnalysis = useSuspense(PerImageAnalysisResource.list(), opts);
  useSubscription(PerImageAnalysisResource.list(), doRefresh ? opts : null);
  const analysis = perImageAnalysis.results[0];

  const seriesNames: Record<string, string> = {
    method2Res: 'Resolution',
    goodBraggCandidates: 'Spots',
    totalIntegratedSignal: 'Signal',
  };

  const series = Object.keys(seriesNames).filter(
    (seriesName) =>
      analysis[seriesName as keyof PerImageAnalysisType] &&
      // @ts-ignore
      analysis[seriesName as keyof PerImageAnalysisType].length > 0
  );

  return (
    <PlotEnhancer
      // @ts-ignore
      data={series.map((seriesName, axis) => ({
        text: seriesNames[seriesName],
        x: analysis.imageNumber,
        y: analysis[seriesName as keyof PerImageAnalysisType],
        type: 'scatter',
        mode: 'markers',
        yaxis: `y${axis + 1}`,
      }))}
      layout={{
        xaxis: { domain: [0, 0.8] },
        //   yaxis: {
        //     title: seriesNames[series?.[0]],
        //   },
        yaxis2: {
          // title: seriesNames[series?.[1]],
          side: 'right',
          position: 0.9,
          overlaying: 'y',
        },
        yaxis3: {
          // title: seriesNames[series?.[2]],
          side: 'right',
          position: 0.8,
          overlaying: 'y',
        },
      }}
    />
  );
}

export default function PerImageAnalysis(props: IPerImageAnalysis) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  return inView ? (
    <Suspense fallback={<Loading />}>
      <PerImageAnalysisMain {...props} />
    </Suspense>
  ) : (
    <div ref={ref}>
      <Loading />
    </div>
  );
}
