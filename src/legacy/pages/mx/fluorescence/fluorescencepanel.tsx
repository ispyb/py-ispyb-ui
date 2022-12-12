import { Card, Row, Col, Container, Badge, Button } from 'react-bootstrap';

import { FluorescenceSpectra } from 'legacy/pages/mx/model';
import './fluorescencepanel.css';
import moment from 'moment';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import { getJpegxrfscan } from 'legacy/api/ispyb';
import ZoomImage from 'legacy/components/image/zoomimage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import { openInNewTab } from 'legacy/helpers/opentab';

type Props = {
  sessionId: string;
  proposalName: string;
  spectra: FluorescenceSpectra;
};

export default function FluorescencePanel({
  proposalName,
  spectra,
  sessionId,
}: Props) {
  const url = `/legacy/proposals/${proposalName}/MX/${sessionId}/xrf/${spectra.xfeFluorescenceSpectrumId}`;
  return (
    <Card className="themed-card card-energyscan-panel">
      <Card.Header>
        <Container fluid>
          <Row>
            <Col md="auto">
              <h5>
                {moment(spectra.startTime, 'MMMM Do YYYY, h:mm:ss A').format(
                  'DD/MM/YYYY HH:mm:ss'
                )}
                <Badge bg="info">Fluorescence spectra</Badge>
              </h5>
            </Col>
            <Col></Col>
            <Col style={{ display: 'flex' }} md="auto">
              <p style={{ margin: 0, alignSelf: 'center' }}>
                {spectra.scanFileFullPath}
              </p>
            </Col>
          </Row>
        </Container>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <SimpleParameterTable
              parameters={[
                {
                  key: 'Protein',
                  value: spectra.acronym ? `${spectra.acronym}` : 'unknown',
                },
                {
                  key: 'Sample',
                  value: spectra.name ? `${spectra.name}` : 'unknown',
                },
                { key: 'Filename', value: spectra.filename },
                { key: 'Energy', value: `${spectra.energy} keV` },
                {
                  key: 'Flux',
                  value: spectra.flux ? `${spectra.flux}  ph/sec` : 'unknown',
                },
                {
                  key: 'Transmission',
                  value: spectra.beamTransmission
                    ? `${spectra.beamTransmission}  %`
                    : 'unknown',
                },
                {
                  key: 'Beam Size Hor',
                  value: `${spectra.beamSizeHorizontal} μm`,
                },
                {
                  key: 'Beam Size Vert',
                  value: `${spectra.beamSizeVertical} μm`,
                },
                {
                  key: 'Exposure Time',
                  value: spectra.exposureTime
                    ? `${spectra.exposureTime}  s`
                    : 'unknown',
                },
              ]}
            ></SimpleParameterTable>
          </Col>
          <Col>
            <ZoomImage
              style={{ maxWidth: 600, maxHeight: 300 }}
              alt="Scan thumbnail"
              src={
                getJpegxrfscan({
                  proposalName,
                  xfeFluorescenceSpectrumId: spectra.xfeFluorescenceSpectrumId,
                }).url
              }
            ></ZoomImage>
            <Row>
              <Col>
                <Button
                  style={{ margin: 5 }}
                  onClick={() => {
                    openInNewTab(url);
                  }}
                >
                  Open spectrum{' '}
                  <FontAwesomeIcon icon={faWindowRestore}></FontAwesomeIcon>
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
