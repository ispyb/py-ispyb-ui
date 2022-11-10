import { useSSXDataCollectionProcessings } from 'hooks/pyispyb';
import { Col, Row } from 'react-bootstrap';
import { Suspense } from 'react';
import LoadingPanel from 'components/loading/loadingpanel';
import ZoomImage from 'components/image/zoomimage';
import PlotWidget from 'components/plotting/plotwidget';
import { DataCollection } from 'models/Event';
import _, { round } from 'lodash';

function getColorFromHitPercent(hitPercent: number) {
  if (hitPercent >= 75) {
    return '#71db44';
  } else if (hitPercent >= 50) {
    return '#a2cf4e';
  } else if (hitPercent >= 25) {
    return '#edc132';
  }
  return '#c9483e';
}

export default function SSXDataCollectionSummary({ dc }: { dc: DataCollection }) {
  return (
    <Row>
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
      <Col>
        <Suspense fallback={<LoadingPanel></LoadingPanel>}>
          <UnitCellStatistics dc={dc}></UnitCellStatistics>
        </Suspense>
      </Col>
    </Row>
  );
}

export function HitsStatistics({ dc }: { dc: DataCollection }) {
  const { data, isError } = useSSXDataCollectionProcessings({ datacollectionIds: [dc.dataCollectionId] });

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
  const { data, isError } = useSSXDataCollectionProcessings({ datacollectionIds: [dc.dataCollectionId], includeCells: true });

  if (isError) throw Error(isError);

  if (data == undefined || data.length == 0) {
    return <></>;
  }

  const proc = data[0];

  const cells = ['a', 'b', 'c', 'alpha', 'beta', 'gamma'];

  return (
    <>
      <Row>
        {cells.map((cell, index) => {
          return (
            <Col key={cell} md={'auto'}>
              <UnitCellParamGraph name={cell} data={proc.unit_cells.map((row) => row[index])}></UnitCellParamGraph>
            </Col>
          );
        })}
      </Row>
    </>
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

export function UnitCellParamGraph({ name, data: dataWithOutliers }: { name: string; data: number[] }) {
  const data = filterOutliers(dataWithOutliers);
  const maxValue = _(data).max();
  const minValue = _(data).min();

  if (maxValue == undefined || minValue == undefined) return null;

  const range = _.range(minValue, maxValue, (maxValue - minValue) / 100);
  const binEdges = [...range, maxValue];

  const x = range;
  const y = range.map((lower, index) => {
    const higher = binEdges[index + 1];
    return data.filter((v) => v >= lower && v < higher).length;
  });

  return (
    <PlotWidget
      data={[
        {
          type: 'bar',
          y: y,
          x: x,
          opacity: 0.75,
        },
      ]}
      layout={{ height: 150, width: 300, title: `${name}` }}
      compact
    />
  );
}
