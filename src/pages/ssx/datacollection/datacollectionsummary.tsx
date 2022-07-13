import SimpleParameterTable from 'components/table/simpleparametertable';
import { Col, Row } from 'react-bootstrap';
import { SSXDataCollectionResponse } from '../model';

export default function SSXDataCollectionSummary({ dc }: { dc: SSXDataCollectionResponse }) {
  return (
    <Row>
      <Col>
        <SimpleParameterTable
          parameters={[
            { key: 'Sample name', value: dc.SSXSpecimen.Specimen.Macromolecule.acronym },
            { key: 'Experiment type', value: dc.DataCollection.experimentType },
            { key: 'Support', value: dc.SSXSpecimen.sampleSupport },

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
        <div style={{ textAlign: 'center' }}>TODO: Autoprocessing summary </div>
      </Col>
      <Col>
        <div style={{ textAlign: 'center' }}>TODO: Max projection </div>
      </Col>
      <Col>
        <div style={{ textAlign: 'center' }}>TODO: Hit map </div>
      </Col>
    </Row>
  );
}
