import { useDataCollectionGraphData, useDataCollectionGraphs, useSSXDataCollectionHits } from 'hooks/pyispyb';
import { Col, Row } from 'react-bootstrap';
import { GraphResponse, SSXDataCollectionResponse } from '../model';
import { Suspense } from 'react';
import LoadingPanel from 'components/loading/loadingpanel';
import ZoomImage from 'components/image/zoomimage';
import _, { round } from 'lodash';
import PlotWidget from 'components/plotting/plotwidget';
import { DataCollection } from 'models/Event';

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
  const { data: hits, isError } = useSSXDataCollectionHits(dc.dataCollectionId);

  if (isError) throw Error(isError);

  if (hits == undefined || !dc.numberOfImages) {
    return <></>;
  }

  const hitPercent = round((hits.nbHits / dc.numberOfImages) * 100, 2);
  const hitColor = getColorFromHitPercent(hitPercent);
  const indexedPercent = round((hits.nbIndexed / dc.numberOfImages) * 100, 2);
  const indexedColor = getColorFromHitPercent(indexedPercent);

  return (
    <PlotWidget
      data={[
        {
          type: 'sunburst',
          labels: ['Images', 'Hits', 'Indexed'],
          parents: ['', 'Images', 'Hits', 'Hits'],
          values: [dc.numberOfImages, hits.nbHits, hits.nbIndexed],
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
  const { data: graphs, isError } = useDataCollectionGraphs(dc.dataCollectionId);

  if (isError) throw Error(isError);

  if (graphs == undefined || graphs.length == 0) {
    return <></>;
  }

  return (
    <>
      <Row>
        {graphs.map((g) => {
          return (
            <Col key={g.graphId} md={'auto'}>
              <UnitCellParamGraph graph={g}></UnitCellParamGraph>
            </Col>
          );
        })}
      </Row>
    </>
  );
}

export function UnitCellParamGraph({ graph }: { graph: GraphResponse }) {
  const { data: values, isError } = useDataCollectionGraphData(graph.graphId);

  if (isError) throw Error(isError);

  if (values == undefined || values.length == 0) {
    return <></>;
  }

  const maxValue = _(values)
    .map((v) => v.y)
    .max();

  const data = values.filter((a) => (maxValue ? a.y > 0.01 * maxValue : true));

  return (
    <PlotWidget
      data={[
        {
          type: 'bar',
          x: data.map((p) => p.x),
          y: data.map((p) => p.y),
        },
      ]}
      layout={{ height: 150, width: 300, title: `${graph.name}` }}
      compact
    />
  );
}
