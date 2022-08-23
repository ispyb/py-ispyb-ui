import SimpleParameterTable from 'components/table/simpleparametertable';
import { useDataCollectionGraphData, useDataCollectionGraphs, useSSXDataCollectionSample } from 'hooks/pyispyb';
import { Button, Col, Row } from 'react-bootstrap';
import { SSXDataCollectionResponse } from '../model';

export default function SSXDataCollectionSummary({ dc }: { dc: SSXDataCollectionResponse }) {
  const { data: sample, isError } = useSSXDataCollectionSample(dc.DataCollection.dataCollectionId);

  if (isError) throw Error(isError);

  return (
    <Row>
      <Col>
        <SimpleParameterTable
          parameters={[
            { key: 'Sample name', value: sample?.name },
            { key: 'Experiment type', value: dc.DataCollection.experimentType },
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
      <Col>
        <div style={{ textAlign: 'center' }}>
          <p>TODO: Autoprocessing summary</p>
        </div>
      </Col>
      <Col>
        <UnitCellStatistics dc={dc}></UnitCellStatistics>
      </Col>
    </Row>
  );
}

import { BarChart, Bar, Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import { useState } from 'react';

export function UnitCellStatistics({ dc }: { dc: SSXDataCollectionResponse }) {
  const { data: graphs, isError } = useDataCollectionGraphs(dc.DataCollection.dataCollectionId);

  const [selected, setSelected] = useState(0);

  if (isError) throw Error(isError);

  if (graphs == undefined || graphs.length == 0) {
    return <></>;
  }

  return (
    <>
      <Row>
        {graphs.map((g) => (
          <Col>
            <Button onClick={() => setSelected(graphs.indexOf(g))}>{g.name}</Button>
          </Col>
        ))}
      </Row>
      <UnitCellParamGraph graphId={graphs[selected].graphId}></UnitCellParamGraph>
    </>
  );
}

export function UnitCellParamGraph({ graphId }: { graphId: number }) {
  const { data: values, isError } = useDataCollectionGraphData(graphId);

  if (isError) throw Error(isError);

  if (values == undefined || values.length == 0) {
    return <></>;
  }

  const data = values.map((a) => {
    return { value: a.x, frequency: a.y };
  });

  return (
    <BarChart
      width={500}
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
      <Bar dataKey="frequency" fill="#8884d8" />
    </BarChart>
  );
}
