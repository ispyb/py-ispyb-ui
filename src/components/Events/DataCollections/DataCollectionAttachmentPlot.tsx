import { Suspense, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useResource, useSuspense } from 'rest-hooks';
import { parse } from 'papaparse';

import { DataCollectionFileAttachmentResource } from 'api/resources/DataCollectionFileAttachment';
import { ErrorBoundary, getXHRArrayBuffer } from 'api/resources/XHRFile';
import PlotEnhancer from 'components/Stats/PlotEnhancer';
import { useAuth } from 'hooks/useAuth';

interface IDataCollectionAttachmentPlot {
  dataCollectionId: number;
  xAxisTitle?: string;
  yAxisTitle?: string;
}

function DataCollectionAttachmentPlotMain({
  dataCollectionId,
  xAxisTitle,
  yAxisTitle,
}: IDataCollectionAttachmentPlot) {
  const { site } = useAuth();
  const attachments = useSuspense(DataCollectionFileAttachmentResource.getList, {
    skip: 0,
    limit: 10,
    dataCollectionId,
  });

  const plots = useMemo(
    () =>
      attachments.results.filter((attachment) => attachment.fileType === 'xy'),
    [attachments]
  );
  const plot = plots.length && plots[0];
  const buffer = useResource(
    getXHRArrayBuffer,
    plot
      ? {
          src: site.host + plot._metadata.url,
        }
      : null
  );
  const enc = new TextDecoder('utf-8');
  if (!buffer) return <p>No data available</p>;

  const text = enc.decode(buffer);
  const stripped = text.replace('# ', '');
  const parsed = parse(stripped, { delimiter: '\t', header: true });

  const xSeries = parsed.meta.fields?.[0];
  const series = parsed.meta.fields?.slice(1);

  return (
    <>
      {xSeries && series && (
        <PlotEnhancer
          // @ts-ignore
          data={series.map((seriesName) => ({
            name: seriesName,
            x: parsed.data.map((dat: any) => dat[xSeries]),
            y: parsed.data.map((dat: any) => dat[seriesName]),
            type: 'line',
          }))}
          layout={{
            uirevision: 'true',
            showlegend: true,
            legend: {
              x: 1,
              xanchor: 'right',
              y: 1,
            },
            xaxis: {
              title: {
                text: xAxisTitle,
              },
            },
            yaxis: {
              title: {
                text: yAxisTitle,
              },
            },
          }}
        />
      )}
    </>
  );
}

export default function DataCollectionAttachmentPlot(
  props: IDataCollectionAttachmentPlot
) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <>
      {inView && (
        <ErrorBoundary>
          <Suspense fallback="Loading...">
            <DataCollectionAttachmentPlotMain {...props} />
          </Suspense>
        </ErrorBoundary>
      )}
      {!inView && <div ref={ref}></div>}
    </>
  );
}
