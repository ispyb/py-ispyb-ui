import SimpleParameterTable from 'components/table/simpleparametertable';
import { Col, Row } from 'react-bootstrap';
import { SSXDataCollectionResponse } from '../model';

export default function SSXDataCollectionExperiment({ dc }: { dc: SSXDataCollectionResponse }) {
  return (
    <Row>
      <Col>
        <SimpleParameterTable
          parameters={[
            { key: 'Experiment type', value: dc.DataCollection.experimentType },
            { key: 'Wavelength', value: dc.DataCollection.wavelength },
            { key: 'Temperature', value: dc.DataCollection.averageTemperature },
          ]}
        ></SimpleParameterTable>
      </Col>
      <Col>
        <div style={{ textAlign: 'center' }}>TODO: Time delays</div>
      </Col>
    </Row>
  );
}
