import SimpleParameterTable from 'components/table/simpleparametertable';
import { useDataCollectionGraphData, useDataCollectionGraphs, useSSXDataCollectionHits, useSSXDataCollectionSample } from 'hooks/pyispyb';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { GraphResponse, SSXDataCollectionResponse } from '../model';
import { BarChart, Bar, Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie } from 'recharts';
import { Suspense, useState } from 'react';
import LoadingPanel from 'components/loading/loadingpanel';

export default function SSXDataCollectionSummary({ dc }: { dc: SSXDataCollectionResponse }) {
  const { data: sample, isError } = useSSXDataCollectionSample(dc.DataCollection.dataCollectionId);

  if (isError) throw Error(isError);

  return (
    <Row>
      <Col style={{ maxWidth: 400 }}>
        <SimpleParameterTable
          parameters={[
            { key: 'Sample name', value: sample?.name },
            { key: 'Experiment type', value: dc.DataCollection.DataCollectionGroup.experimentType },
            { key: 'Support', value: 'TODO' },

            { key: 'Exposure time', value: dc.DataCollection.exposureTime, units: 's' },
            { key: 'Repetition rate', value: dc.repetitionRate },
            { key: 'Wavelength', value: dc.DataCollection.wavelength },
            { key: 'Flux', value: dc.DataCollection.flux },
            { key: 'Transmission', value: dc.DataCollection.transmission, units: '%' },
            { key: 'Detector distance', value: dc.DataCollection.detectorDistance, units: 'mm' },
          ]}
        ></SimpleParameterTable>
      </Col>
      <Col md={'auto'}>
        <Suspense fallback={<LoadingPanel></LoadingPanel>}>
          <HitsStatistics dc={dc}></HitsStatistics>
        </Suspense>
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

const GRAPHS = ['a', 'b', 'c', 'alpha', 'beta', 'gamma'];

export function UnitCellStatistics({ dc }: { dc: SSXDataCollectionResponse }) {
  const { data: graphs, isError } = useDataCollectionGraphs(dc.DataCollection.dataCollectionId);

  const [selected, setSelected] = useState(0);

  if (isError) throw Error(isError);

  if (graphs == undefined || graphs.length == 0) {
    return <></>;
  }

  return (
    <>
      <Suspense fallback={<LoadingPanel></LoadingPanel>}>
        <UnitCellParamGraph graph={graphs[selected]}></UnitCellParamGraph>
      </Suspense>
      <Row style={{ marginLeft: 45, marginBottom: 5 }}>
        <Col></Col>
        <Col>
          <ButtonGroup size="sm">
            {graphs
              .filter((g) => GRAPHS.includes(g.name))
              .sort((a, b) => GRAPHS.indexOf(a.name) - GRAPHS.indexOf(b.name))
              .map((g) => (
                <Button variant="secondary" active={graphs[selected] == g} onClick={() => setSelected(graphs.indexOf(g))}>
                  {g.name}
                </Button>
              ))}
          </ButtonGroup>
        </Col>
        <Col></Col>
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

  const data = values.map((a) => {
    return { value: a.x, frequency: a.y };
  });

  return (
    <ResponsiveContainer width="100%" height={300} debounce={1}>
      <BarChart
        height={300}
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
        <Bar name={`Unit cell ${graph.name} frequency`} dataKey="frequency" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
