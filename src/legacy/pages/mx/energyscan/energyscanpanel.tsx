import { Card, Row, Col, Container, Badge } from 'react-bootstrap';

import { EnergyScan } from 'legacy/pages/mx/model';
import './energyscanpanel.css';
import moment from 'moment';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import { getJpegchooch } from 'legacy/api/ispyb';
import ZoomImage from 'legacy/components/image/zoomimage';
import { HashAnchorButton, useHashScroll } from 'hooks/hashScroll';
import { CopyValue } from 'components/Common/CopyValue';

type Props = {
  sessionId: string;
  proposalName: string;
  energyScan: EnergyScan;
};

export default function EnergyScanPanel({ proposalName, energyScan }: Props) {
  const hashscroll = useHashScroll(`es-${energyScan.energyScanId}`);
  return (
    <Card
      className="themed-card card-energyscan-panel"
      ref={hashscroll.ref}
      style={{
        backgroundColor: hashscroll.isCurrent ? '#edf2ff' : undefined,
      }}
    >
      <Card.Header>
        <Container fluid>
          <Row>
            <Col xs={'auto'}>
              <HashAnchorButton hash={hashscroll.hash} />
            </Col>
            <Col md="auto">
              <h5>
                {moment(energyScan.startTime, 'MMMM Do YYYY, h:mm:ss A').format(
                  'DD/MM/YYYY HH:mm:ss'
                )}
                <Badge bg="info">Energy scan</Badge>
              </h5>
            </Col>
          </Row>
        </Container>
      </Card.Header>
      <Card.Body>
        <Container fluid>
          <Row style={{ margin: '1rem' }}>
            <Col
              xs={'auto'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
              }}
            >
              <strong>Path:</strong>
            </Col>
            <Col
              xs={'auto'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >
              <CopyValue value={energyScan.scanFileFullPath} />
            </Col>
          </Row>
          <Row>
            <Col md={'auto'}>
              <div className="elementName">
                <p>{energyScan.element}</p>
              </div>
            </Col>
            <Col>
              <SimpleParameterTable
                parameters={[
                  {
                    key: 'Protein',
                    value: energyScan.acronym
                      ? `${energyScan.acronym}`
                      : 'unknown',
                  },
                  {
                    key: 'Sample',
                    value: energyScan.name ? `${energyScan.name}` : 'unknown',
                  },
                  { key: 'Filename', value: energyScan.filename },
                  {
                    key: 'Fluorescence Detector',
                    value: energyScan.fluorescenceDetector,
                  },
                  {
                    key: 'Energy Scan Range',
                    value: `${energyScan.startEnergy} keV - ${energyScan.endEnergy} keV`,
                  },
                  {
                    key: 'Edge Energy (theoretical)',
                    value: `${energyScan.edgeEnergy} keV`,
                  },
                  {
                    key: 'Flux @100%',
                    value: energyScan.flux
                      ? `${energyScan.flux}  ph/sec`
                      : 'unknown',
                  },
                  {
                    key: 'Transmission',
                    value: energyScan.transmissionFactor
                      ? `${energyScan.transmissionFactor}  %`
                      : 'unknown',
                  },
                  {
                    key: 'Beam Size Hor',
                    value: `${energyScan.beamSizeHorizontal} μm`,
                  },
                  {
                    key: 'Beam Size Vert',
                    value: `${energyScan.beamSizeVertical} μm`,
                  },
                  {
                    key: 'Exposure Time',
                    value: energyScan.exposureTime
                      ? `${energyScan.exposureTime}  s`
                      : 'unknown',
                  },
                ]}
              ></SimpleParameterTable>
            </Col>
            <Col>
              <SimpleParameterTable
                parameters={[
                  { key: 'Peak Energy', value: `${energyScan.peakEnergy} keV` },
                  { key: "Pk f'", value: `${energyScan.peakFPrime} e-` },
                  { key: "Pk f''", value: `${energyScan.peakFDoublePrime} e-` },
                  {
                    key: 'Inflection Energy',
                    value: `${energyScan.inflectionEnergy} keV`,
                  },
                  { key: "Ip f'", value: `${energyScan.inflectionFPrime} e-` },
                  {
                    key: "Ip f''",
                    value: `${energyScan.inflectionFDoublePrime} e-`,
                  },
                ]}
              ></SimpleParameterTable>
            </Col>
            <Col md={3}>
              <ZoomImage
                style={{ maxWidth: 300 }}
                alt="Dozor"
                src={
                  getJpegchooch({
                    proposalName,
                    energyscanId: energyScan.energyScanId,
                  }).url
                }
              ></ZoomImage>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
}
