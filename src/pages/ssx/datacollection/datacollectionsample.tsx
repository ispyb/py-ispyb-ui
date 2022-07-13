import SimpleParameterTable from 'components/table/simpleparametertable';
import { Col, Row } from 'react-bootstrap';
import { SSXDataCollectionResponse } from '../model';

export default function SSXDataCollectionSample({ dc }: { dc: SSXDataCollectionResponse }) {
  return (
    <Row>
      <Col>
        <SimpleParameterTable
          parameters={[
            { key: 'Sample name', value: dc.SSXSpecimen.Specimen.Macromolecule.acronym },
            { key: 'Avg crystal size', value: dc.SSXSpecimen.avgXtalSize },
            { key: 'Crystal concentration', value: dc.SSXSpecimen.Specimen.concentration },
            { key: 'Support', value: dc.SSXSpecimen.sampleSupport },
          ]}
        ></SimpleParameterTable>
      </Col>
      <Col>
        <div style={{ textAlign: 'center' }}>TODO: Preparation </div>
      </Col>
      <Col>
        <div style={{ textAlign: 'center' }}>TODO: Crystal form </div>
      </Col>
      <Col>
        <div style={{ textAlign: 'center' }}>TODO: Ligand </div>
      </Col>
      <Col>
        <div style={{ textAlign: 'center' }}>TODO: pictures?? </div>
      </Col>
    </Row>
  );
}
