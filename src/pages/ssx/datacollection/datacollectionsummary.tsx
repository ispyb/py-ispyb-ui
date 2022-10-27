import { useDataCollectionGraphData, useDataCollectionGraphs, useSSXDataCollectionHits } from 'hooks/pyispyb';
import { Col, Row } from 'react-bootstrap';
import { GraphResponse, SSXDataCollectionResponse } from '../model';
import { BarChart, Bar, Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { Suspense } from 'react';
import LoadingPanel from 'components/loading/loadingpanel';
import ZoomImage from 'components/image/zoomimage';
import _ from 'lodash';

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

  const data = [
    { name: 'images', nb: dc.DataCollection.numberOfImages, fill: '#345a8c' },
    { name: 'hits', nb: hits.nbHits, fill: '#d0ed57' },
    { name: 'indexed', nb: hits.nbIndexed, fill: '#a4de6c' },
  ];

  const style = {
    bottom: '50%',
    right: '50%',
    transform: 'translate(50%, 110%)',
    lineHeight: '24px',
  };

  return (
    <>
      <ResponsiveContainer width={300} height={300} debounce={1}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={30} data={data} startAngle={180} endAngle={0}>
          <RadialBar label={{ position: 'insideStart', fill: '#fff' }} background dataKey="nb" isAnimationActive={false} />
          <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
        </RadialBarChart>
      </ResponsiveContainer>
    </>
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
              <Suspense fallback={<LoadingPanel></LoadingPanel>}>
                <UnitCellParamGraph graph={g}></UnitCellParamGraph>
              </Suspense>
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

  const data = values
    .filter((a) => (maxValue ? a.y > 0.01 * maxValue : true))
    .map((a) => {
      return { value: a.x, frequency: a.y };
    });

  return (
    <ResponsiveContainer width={300} height={150} debounce={1}>
      <BarChart
        height={150}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="value"></XAxis>
        <YAxis></YAxis>
        <Tooltip />
        <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '30px' }} />
        <Brush dataKey="value" height={20} stroke="#8884d8" />
        <Bar name={`${graph.name}`} dataKey="frequency" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
