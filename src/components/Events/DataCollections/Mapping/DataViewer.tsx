import { Suspense, useState, useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import { useSuspense } from 'rest-hooks';
import { HeatmapVis, Domain, LineVis, getDomain } from '@h5web/lib';
import ndarray from 'ndarray';

import { H5DataEndpoint } from 'api/resources/H5Grove/Data';
import { H5MetaEndpoint } from 'api/resources/H5Grove/Meta';
import NetworkErrorPage from 'components/NetworkErrorPage';
import { DataCollection as DataCollectionType } from 'models/Event';

function useDataSeries({
  dataCollectionId,
  path,
}: {
  dataCollectionId: number;
  path: string;
}): Record<string, Series[]> {
  const meta = useSuspense(H5MetaEndpoint, {
    dataCollectionId,
    path: path,
  });
  const children = meta.children as Series[];
  return useMemo(() => {
    const twoD = children.filter((child) => child.shape.length === 2);
    const threeD = children.filter((child) => child.shape.length === 3);
    const seriesTypes: Record<string, Series[]> = {};

    if (twoD.length) seriesTypes['2'] = twoD;
    if (threeD.length) seriesTypes['3'] = threeD;
    return seriesTypes;
  }, [children]);
}

function useDataPoint({
  dataCollectionId,
  path,
  selectedPoint,
  flatten = false,
  fetch = true,
}: {
  dataCollectionId: number;
  path: string;
  selectedPoint: number;
  flatten: boolean;
  fetch: boolean;
}) {
  const data = useSuspense(
    H5DataEndpoint,
    fetch
      ? {
          dataCollectionId,
          path: path,
          // Selection in h5grove is zero-offset
          selection: selectedPoint - 1,
          flatten,
        }
      : null
  );
  return data && data.data;
}

// const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'];
const DEFAULT_DOMAIN: Domain = [0.1, 1];

interface PlotData {
  data: number[];
  series: Series[];
}

function Plot1d({ data, series }: PlotData) {
  const dataArray = useMemo(() => ndarray(data), [data]);
  const yDomain = getDomain(dataArray) || DEFAULT_DOMAIN;

  return (
    <div className="h5web-1dplot">
      <LineVis
        dataArray={dataArray}
        domain={yDomain}
        abscissaParams={{
          label: 'Channel',
        }}
        ordinateLabel="Count"
        renderTooltip={(data) => <>{data}</>}
      />
    </div>
  );
}

export const ZOOM_KEY = 'Shift';

function Plot2d({ data, series }: PlotData) {
  const domain = useMemo(() => [0, 255] as Domain, []);
  const dataArray = useMemo(
    () =>
      ndarray(new Float32Array(data), [series[0].shape[1], series[0].shape[2]]),
    [data, series]
  );

  return (
    <div className="braggy" style={{ display: 'flex', flex: 1 }}>
      <HeatmapVis
        dataArray={dataArray}
        domain={domain}
        interactions={{ selectToZoom: { modifierKey: ZOOM_KEY } }}
      />
    </div>
  );
}

interface Series {
  attributes: Record<string, any>[];
  name: string;
  shape: number[];
}

interface IDataPlot extends IDataViewer {
  series: Series[];
}

function DataPlot(props: IDataPlot) {
  const { dataCollection, selectedPoint, series } = props;
  const { dataCollectionId, imageContainerSubPath = '/' } = dataCollection;
  const data = useDataPoint({
    dataCollectionId,
    path: `${imageContainerSubPath}/${series?.[0].name}`,
    selectedPoint,
    flatten: series?.[0].shape.length === 3,
    fetch: series && series.length > 0,
  });

  if (!data) return <p>No Data</p>;
  if (!(series && series.length > 0)) return <p>No Data</p>;
  return series[0].shape.length === 2 ? (
    <Plot1d data={data} series={series} />
  ) : (
    <Plot2d data={data} series={series} />
  );
}

interface IDataViewer {
  selectedPoint: number;
  dataCollection: DataCollectionType;
}

export function DataViewerMain(props: IDataViewer) {
  const { dataCollectionId, imageContainerSubPath = '/' } =
    props.dataCollection;
  const seriesTypes = useDataSeries({
    dataCollectionId,
    path: '/' + imageContainerSubPath,
  });

  const [selectedSeries, setSelectedSeries] = useState<string>(
    Object.keys(seriesTypes).length ? Object.keys(seriesTypes)[0] : '2'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {Object.keys(seriesTypes).length > 1 && (
        <Form.Control
          as="select"
          onChange={(evt) => setSelectedSeries(evt.target.value)}
        >
          {Object.entries(seriesTypes).map(
            ([seriesType, series]: [string, Series[]]) => (
              <option key={seriesType} value={seriesType}>
                {series.map((serie) => serie.name).join(',')}
              </option>
            )
          )}
        </Form.Control>
      )}
      <Suspense fallback="Loading...">
        <DataPlot {...props} series={seriesTypes[selectedSeries]} />
      </Suspense>
    </div>
  );
}

export default function DataViewer(props: IDataViewer) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <>
      {inView && (
        <Suspense fallback={'Loading...'}>
          <NetworkErrorPage>
            <DataViewerMain {...props} />
          </NetworkErrorPage>
        </Suspense>
      )}
      {!inView && <div ref={ref}></div>}
    </>
  );
}
