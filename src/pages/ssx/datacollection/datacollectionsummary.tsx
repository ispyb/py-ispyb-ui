import { useSSXDataCollectionProcessingCells, useSSXDataCollectionProcessingCellsHistogram, useSSXDataCollectionProcessingStats } from 'hooks/pyispyb';
import { Col, Row } from 'react-bootstrap';
import { Suspense } from 'react';
import LoadingPanel from 'components/loading/loadingpanel';
import ZoomImage from 'components/image/zoomimage';
import PlotWidget from 'components/plotting/plotwidget';
import { DataCollection } from 'models/Event';
import _, { round } from 'lodash';
import { getColorFromHitPercent } from 'helpers/ssx';
import LazyWrapper from 'components/loading/lazywrapper';
import { SSXDataCollectionProcessingCellsHistogram } from 'models/SSXDataCollectionProcessingCellsHistogram';
import { Histogram } from 'models/Histogram';

export default function SSXDataCollectionSummary({ dc }: { dc: DataCollection }) {
  return (
    <Row className="flex-nowrap" style={{ overflowX: 'auto' }}>
      <Col md={'auto'}>
        <ZoomImage style={{ maxWidth: 350 }} src="/images/temp/max.png"></ZoomImage>
      </Col>
      <Col md={'auto'}>
        <Suspense fallback={<LoadingPanel></LoadingPanel>}>
          <HitsStatistics dc={dc}></HitsStatistics>
        </Suspense>
      </Col>
      <Col md={'auto'}>
        <ZoomImage style={{ maxWidth: 400 }} src="/images/temp/dozor.png"></ZoomImage>
      </Col>
      <Col md={'auto'}>
        <LazyWrapper>
          <Suspense fallback={<LoadingPanel></LoadingPanel>}>
            <UnitCellStatistics dc={dc}></UnitCellStatistics>
          </Suspense>
        </LazyWrapper>
      </Col>
    </Row>
  );
}

export function HitsStatistics({ dc }: { dc: DataCollection }) {
  const { data, isError } = useSSXDataCollectionProcessingStats({ datacollectionIds: [dc.dataCollectionId] });

  if (isError) throw Error(isError);

  if (data == undefined || !data.length || !dc.numberOfImages) {
    return <></>;
  }

  const proc = data[0];

  const hitPercent = round((proc.nbHits / dc.numberOfImages) * 100, 2);
  const hitColor = getColorFromHitPercent(hitPercent);
  const indexedPercent = round((proc.nbIndexed / dc.numberOfImages) * 100, 2);
  const indexedColor = getColorFromHitPercent(indexedPercent);

  return (
    <PlotWidget
      data={[
        {
          type: 'sunburst',
          labels: ['Images', 'Hits', 'Indexed'],
          parents: ['', 'Images', 'Hits', 'Hits'],
          values: [dc.numberOfImages, proc.nbHits, proc.nbIndexed],
          marker: { line: { width: 1, color: 'white' }, colors: ['rgb(130 174 231)', hitColor, indexedColor] },
          text: ['', `${hitPercent}%`, `${indexedPercent}%`],
          textinfo: 'label+text+value',
          branchvalues: 'total',
        },
      ]}
      config={{ displayModeBar: false }}
      layout={{
        paper_bgcolor: 'transparent',
        margin: { l: 0, r: 0, b: 0, t: 0 },
        width: 300,
        height: 300,
      }}
    />
  );
}

export function UnitCellStatistics({ dc }: { dc: DataCollection }) {
  const { data, isError } = useSSXDataCollectionProcessingCellsHistogram({ datacollectionId: dc.dataCollectionId });

  if (isError) throw Error(isError);

  if (data == undefined) {
    return <></>;
  }
  const cells1: (keyof SSXDataCollectionProcessingCellsHistogram)[] = ['a', 'b', 'c'];
  const cells2: (keyof SSXDataCollectionProcessingCellsHistogram)[] = ['alpha', 'beta', 'gamma'];

  return (
    <Row>
      <Col md={'auto'}>
        <div className="flex-nowrap">
          {cells1.map((cell) => {
            return <UnitCellParamGraph name={cell} data={data[cell]}></UnitCellParamGraph>;
          })}
        </div>
        <div className="flex-nowrap">
          {cells2.map((cell) => {
            return <UnitCellParamGraph name={cell} data={data[cell]}></UnitCellParamGraph>;
          })}
        </div>
      </Col>
    </Row>
  );
}

function filterOutliers(someArray: number[]) {
  // FROM https://stackoverflow.com/a/20811670

  const values = someArray.concat();
  values.sort(function (a, b) {
    return a - b;
  });
  const q1 = values[Math.floor(values.length / 4)];
  const q3 = values[Math.ceil(values.length * (3 / 4))];
  const iqr = q3 - q1;
  const maxValue = q3 + iqr * 1.5;
  const minValue = q1 - iqr * 1.5;
  return values.filter(function (x) {
    return x <= maxValue && x >= minValue;
  });
}

export function UnitCellParamGraph({ name, data }: { name: string; data: Histogram }) {
  return (
    <PlotWidget
      data={[
        {
          type: 'bar',
          y: data.y,
          x: data.x,
          opacity: 0.75,
        },
      ]}
      layout={{
        height: 150,
        width: 300,
        shapes: [
          {
            type: 'line',
            yref: 'paper',
            y0: 0,
            y1: 1,
            x0: data.median,
            x1: data.median,
            line: {
              color: 'red',
              width: 2,
              dash: 'solid',
            },
          },
        ],
        annotations: [
          {
            yref: 'paper',
            y: 1,
            x: data.median,
            text: `median = ${data.median}`,
            showarrow: false,
            yanchor: 'bottom',
            font: { color: 'gray', size: 10 },
          },
        ],
        title: `cell ${name}`,
      }}
      compact
    />
  );
}
