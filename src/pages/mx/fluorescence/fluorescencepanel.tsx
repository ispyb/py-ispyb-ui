import { Card, Row, Col, Container, Badge } from 'react-bootstrap';

import { FluorescenceSpectra } from 'pages/mx/model';
import './fluorescencepanel.css';
import moment from 'moment';
import SimpleParameterTable from 'components/table/simpleparametertable';
import { getJpegxrfscan } from 'api/ispyb';
import ZoomImage from 'components/image/zoomimage';

type Props = {
  sessionId: string;
  proposalName: string;
  spectra: FluorescenceSpectra;
};

export default function FluorescencePanel({ proposalName, spectra }: Props) {
  return (
    <Card className="themed-card card-energyscan-panel">
      <Card.Header>
        <Container fluid>
          <Row>
            <Col md="auto">
              <h5>
                {moment(spectra.startTime, 'MMMM Do YYYY, h:mm:ss A').format('DD/MM/YYYY HH:mm:ss')}
                <Badge bg="info">Fluorescence spectra</Badge>
              </h5>
            </Col>
            <Col></Col>
            <Col style={{ display: 'flex' }} md="auto">
              <p style={{ margin: 0, alignSelf: 'center' }}>{spectra.scanFileFullPath}</p>
            </Col>
          </Row>
        </Container>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <SimpleParameterTable
              parameters={[
                { key: 'Protein', value: spectra.acronym ? `${spectra.acronym}` : 'unknown' },
                { key: 'Sample', value: spectra.name ? `${spectra.name}` : 'unknown' },
                { key: 'Filename', value: spectra.filename },
                { key: 'Fluorescence Detector', value: 'unknown' },
                { key: 'Energy', value: `${spectra.energy} keV` },
                { key: 'Flux @100%', value: spectra.flux ? `${spectra.flux}  ph/sec` : 'unknown' },
                { key: 'Transmission', value: spectra.beamTransmission ? `${spectra.beamTransmission}  %` : 'unknown' },
                { key: 'Beam Size Hor', value: `${spectra.beamSizeHorizontal} μm` },
                { key: 'Beam Size Vert', value: `${spectra.beamSizeVertical} μm` },
                { key: 'Exposure Time', value: spectra.exposureTime ? `${spectra.exposureTime}  s` : 'unknown' },
              ]}
            ></SimpleParameterTable>
          </Col>
          <Col>
            {<ZoomImage style={{ maxWidth: 600 }} alt="Dozor" src={getJpegxrfscan({ proposalName, xfeFluorescenceSpectrumId: spectra.xfeFluorescenceSpectrumId }).url}></ZoomImage>}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
