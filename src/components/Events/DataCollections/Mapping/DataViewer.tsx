import { Suspense, useState, useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import { useSuspense } from 'rest-hooks';
import {
  HeatmapVis,
  VisCanvas,
  DataCurve,
  Zoom,
  Pan,
  Domain,
  useCombinedDomain,
  useDomains,
} from '@h5web/lib';
import { range } from 'lodash';
import ndarray from 'ndarray';

import { H5DataResource } from 'api/resources/H5Grove/Data';
import { H5MetaResource } from 'api/resources/H5Grove/Meta';
import NetworkErrorPage from 'components/NetworkErrorPage';
import { DataCollection as DataCollectionType } from 'models/Event.d';

function useDataSeries({
  dataCollectionId,
  path,
}: {
  dataCollectionId: number;
  path: string;
}): Record<string, Series[]> {
  const meta = useSuspense(H5MetaResource.list(), {
    dataCollectionId,
    path: path,
  });
  const children = meta.children as Series[];
  return useMemo(() => {
    const seriesTypes = {
      2: children.filter((child) => child.shape.length === 2),
      3: children.filter((child) => child.shape.length === 3),
    };

    // @ts-expect-error
    if (!seriesTypes['2'].length) delete seriesTypes['2'];
    // @ts-expect-error
    if (!seriesTypes['3'].length) delete seriesTypes['3'];
    return seriesTypes;
  }, [children]);
}

function useDataPoint({
  dataCollectionId,
  path,
  selectedPoint,
  flatten = false,
}: {
  dataCollectionId: number;
  path: string;
  selectedPoint: number;
  flatten: boolean;
}) {
  const data = useSuspense(H5DataResource.list(), {
    dataCollectionId,
    path: path,
    // Selection in h5grove is zero-offset
    selection: [selectedPoint - 1],
    flatten,
  });
  return data.data;
}

const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'];
const DEFAULT_DOMAIN: Domain = [0.1, 1];

interface PlotData {
  data: number[];
  series: Series[];
}

function Plot1d({ data, series }: PlotData) {
  const xdata = useMemo(() => range(data.length), [data]);

  const yDomain = useCombinedDomain(useDomains([data])) || DEFAULT_DOMAIN;
  const xDomain = useCombinedDomain(useDomains([xdata])) || DEFAULT_DOMAIN;

  return (
    <VisCanvas
      abscissaConfig={{
        visDomain: xDomain,
        showGrid: true,
        label: 'Channel',
      }}
      ordinateConfig={{
        visDomain: yDomain,
        showGrid: true,
        label: 'Count',
      }}
    >
      {series.map((c) => (
        <DataCurve
          key={c.name}
          abscissas={xdata}
          ordinates={data}
          color={COLORS[0]}
        />
      ))}
      <Pan />
      <Zoom />
    </VisCanvas>
  );
}

export const ZOOM_KEY = 'Shift';

function Plot2d({ data, series }: PlotData) {
  const domain = useMemo(() => [0, 255], []);
  const dataArray = useMemo(
    () =>
      ndarray(new Float32Array(data), [series[0].shape[2], series[0].shape[1]]),
    [data, series]
  );

  return (
    <HeatmapVis
      dataArray={dataArray}
      // @ts-expect-error
      domain={domain}
      // scaleType={scaleType}
      // colorMap={colorMap}
      // invertColorMap={invertColorMap}
      showGrid={true}
      interactions={{ selectToZoom: { modifierKey: ZOOM_KEY } }}
      show
    />
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
    path: `${imageContainerSubPath}/${series[0].name}`,
    selectedPoint,
    flatten: series[0].shape.length === 3,
  });

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
    <>
      {Object.keys(seriesTypes).length > 1 && (
        <Form.Control
          as="select"
          onChange={(evt) => setSelectedSeries(evt.target.value)}
        >
          {Object.entries(seriesTypes).map(
            ([seriesType, series]: [string, Series[]]) => (
              <option value={seriesType}>
                {series.map((serie) => serie.name).join(',')}
              </option>
            )
          )}
        </Form.Control>
      )}
      <Suspense fallback="Loading...">
        <DataPlot {...props} series={seriesTypes[selectedSeries]} />
      </Suspense>
    </>
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
