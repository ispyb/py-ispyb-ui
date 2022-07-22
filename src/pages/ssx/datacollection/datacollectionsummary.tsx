import { faInfoCircle, faQuestion, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleParameterTable from 'components/table/simpleparametertable';
import { useSSXDataCollectionSample } from 'hooks/pyispyb';
import { Col, Row } from 'react-bootstrap';
import { SSXDataCollectionResponse } from '../model';

export default function SSXDataCollectionSummary({ dc }: { dc: SSXDataCollectionResponse }) {
  const { data: sample, isError } = useSSXDataCollectionSample(dc.ssxDataCollectionId);

  if (isError) throw Error(isError);

  return (
    <Row>
      <Col>
        <SimpleParameterTable
          parameters={[
            { key: 'Sample name', value: sample?.Specimen.Macromolecule.name },
            { key: 'Experiment type', value: dc.DataCollection.experimentType },
            { key: 'Support', value: sample?.sampleSupport },

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
          <FontAwesomeIcon icon={faQuestionCircle} style={{ marginRight: 10 }} />
        </div>
      </Col>
      <Col>
        <div style={{ textAlign: 'center' }}>
          <p>TODO: Max projection</p>
          <FontAwesomeIcon icon={faQuestionCircle} style={{ marginRight: 10 }} />
        </div>
      </Col>
      <Col>
        <div style={{ textAlign: 'center' }}>
          <p>TODO: Hit map</p>
          <FontAwesomeIcon icon={faQuestionCircle} style={{ marginRight: 10 }} />
        </div>
      </Col>
    </Row>
  );
}
