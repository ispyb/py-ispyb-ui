import { useDataCollectionGraphData, useDataCollectionGraphs, useSSXDataCollectionHits } from 'hooks/pyispyb';
import { Col, Row } from 'react-bootstrap';
import { GraphResponse, SSXDataCollectionResponse } from '../model';
import { Suspense } from 'react';
import LoadingPanel from 'components/loading/loadingpanel';
import ZoomImage from 'components/image/zoomimage';
import _, { round } from 'lodash';
import PlotWidget from 'components/plotting/plotwidget';

export default function SSXDataCollectionSummary({ dc }: { dc: SSXDataCollectionResponse }) {
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

export function HitsStatistics({ dc }: { dc: SSXDataCollectionResponse }) {
  const { data: hits, isError } = useSSXDataCollectionHits(dc.DataCollection.dataCollectionId);

  if (isError) throw Error(isError);

  if (hits == undefined) {
    return <></>;
  }

  return (
    <PlotWidget
      data={[
        {
          type: 'sunburst',
          labels: ['Images', 'Hits', 'Indexed'],
          parents: ['', 'Images', 'Hits', 'Hits'],
          values: [dc.DataCollection.numberOfImages, hits.nbHits, hits.nbIndexed],
          marker: { line: { width: 1, color: 'white' }, colors: ['rgb(130 174 231)', '#d0ed57', '#a4de6c'] },
          text: ['', `${round((hits.nbHits / dc.DataCollection.numberOfImages) * 100, 2)}%`, `${round((hits.nbIndexed / dc.DataCollection.numberOfImages) * 100, 2)}%`],
          textinfo: 'label+text+value',
          branchvalues: 'total',
        },
      ]}
      layout={{
        paper_bgcolor: 'transparent',
        margin: { l: 0, r: 0, b: 0, t: 0 },
        width: 300,
        height: 300,
      }}
    />
  );
}

export function UnitCellStatistics({ dc }: { dc: SSXDataCollectionResponse }) {
  const { data: graphs, isError } = useDataCollectionGraphs(dc.DataCollection.dataCollectionId);

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
