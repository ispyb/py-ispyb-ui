import { H5DataResource } from 'api/resources/H5Grove/Data';
import { H5MetaResource } from 'api/resources/H5Grove/Meta';
import NetworkErrorPage from 'components/NetworkErrorPage';
import { DataCollection as DataCollectionType } from 'models/Event.d';
import { Suspense, useState, useMemo, useEffect } from 'react';
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

function useDataSeries({
  dataCollectionId,
  path,
}: {
  dataCollectionId: number;
  path: string;
}): Series[] {
  const meta = useSuspense(H5MetaResource.list(), {
    dataCollectionId,
    path: path,
  });
  // @ts-expect-error
  return useMemo(
    () => meta.children.filter((child: any) => child.shape.length > 1),
    [meta]
  );
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
    selection: [selectedPoint-1],
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
    <div className="h5web-plot">
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
    </div>
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
    <div>
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
    </div>
  );
}

interface Series {
  attributes: Record<string, any>[];
  name: string;
  shape: number[];
}

interface IDataPlot extends IDataViewer {
  series: Series;
}

function DataPlot(props: IDataPlot) {
  const { dataCollection, selectedPoint, series } = props;
  const { dataCollectionId, imageContainerSubPath = '/' } = dataCollection;
  const data = useDataPoint({
    dataCollectionId,
    path: `${imageContainerSubPath}/${series.name}`,
    selectedPoint,
    flatten: series.shape.length === 3,
  });

  return series.shape.length === 2 ? (
    <Plot1d data={data} series={[series]} />
  ) : (
    <Plot2d data={data} series={[series]} />
  );
}

interface IDataViewer {
  selectedPoint: number;
  dataCollection: DataCollectionType;
}

function DataViewerMain(props: IDataViewer) {
  const { dataCollectionId, imageContainerSubPath = '/' } =
    props.dataCollection;
  const series = useDataSeries({
    dataCollectionId,
    path: '/' + imageContainerSubPath,
  });

  const [selectedSeries, setSelectedSeries] = useState<number>(
    series.length && 0
  );

  useEffect(() => {
    console.log('series', dataCollectionId, series);
  }, [series, dataCollectionId]);

  return (
    <>
      <Form.Control as="select">
        {series.map((serie, id) => (
          <option value={id}>{serie.name}</option>
        ))}
      </Form.Control>
      <DataPlot {...props} series={series[selectedSeries]} />
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
