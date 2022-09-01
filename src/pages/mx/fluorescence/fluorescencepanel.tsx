import { Card, Row, Col, Container, Badge, Button, Modal } from 'react-bootstrap';

import { FluorescenceSpectra } from 'pages/mx/model';
import './fluorescencepanel.css';
import moment from 'moment';
import SimpleParameterTable from 'components/table/simpleparametertable';
import { getJpegxrfscan } from 'api/ispyb';
import ZoomImage from 'components/image/zoomimage';
import FluorescenceGraph from './fluorescencegraph';
import ErrorBoundary from 'components/errors/errorboundary';
import LoadingPanel from 'components/loading/loadingpanel';

import { Suspense, useState } from 'react';

type Props = {
  sessionId: string;
  proposalName: string;
  spectra: FluorescenceSpectra;
};

export default function FluorescencePanel({ proposalName, spectra }: Props) {
  const [showModal, setShowModal] = useState(false);
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
                { key: 'Energy', value: `${spectra.energy} keV` },
                { key: 'Flux', value: spectra.flux ? `${spectra.flux}  ph/sec` : 'unknown' },
                { key: 'Transmission', value: spectra.beamTransmission ? `${spectra.beamTransmission}  %` : 'unknown' },
                { key: 'Beam Size Hor', value: `${spectra.beamSizeHorizontal} μm` },
                { key: 'Beam Size Vert', value: `${spectra.beamSizeVertical} μm` },
                { key: 'Exposure Time', value: spectra.exposureTime ? `${spectra.exposureTime}  s` : 'unknown' },
              ]}
            ></SimpleParameterTable>
          </Col>
          <Col>
            <ZoomImage
              style={{ maxWidth: 600, maxHeight: 300 }}
              alt="Scan thumbnail"
              src={getJpegxrfscan({ proposalName, xfeFluorescenceSpectrumId: spectra.xfeFluorescenceSpectrumId }).url}
            ></ZoomImage>
            <Row>
              <Col>
                <Button style={{ margin: 5 }} onClick={() => setShowModal(true)}>
                  Show interactive graph
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <GraphModal proposalName={proposalName} spectra={spectra} onHide={() => setShowModal(false)} show={showModal}></GraphModal>
      </Card.Body>
    </Card>
  );
}

export function GraphModal({ show, onHide, proposalName, spectra }: { proposalName: string; spectra: FluorescenceSpectra; show: boolean; onHide: () => void }) {
  return (
    <Modal animation={false} onHide={onHide} show={show} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">XRF Viewer </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {show && (
          <Suspense fallback={<LoadingPanel></LoadingPanel>}>
            <ModalContent proposalName={proposalName} spectra={spectra}></ModalContent>
          </Suspense>
        )}
      </Modal.Body>
    </Modal>
  );
}

export function ModalContent({ spectra, proposalName }: { proposalName: string; spectra: FluorescenceSpectra }) {
  return (
    <Row>
      <ErrorBoundary>
        <FluorescenceGraph proposalName={proposalName} spectra={spectra}></FluorescenceGraph>
      </ErrorBoundary>
    </Row>
  );
}
