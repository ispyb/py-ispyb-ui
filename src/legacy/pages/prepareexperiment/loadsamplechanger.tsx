import { ContainerDewar } from 'legacy/pages/model';
import { Card, Tab, Col, Row, Nav, Button } from 'react-bootstrap';

import './loadsamplechanger.scss';

import { useBeamlinesObjects } from 'legacy/hooks/site';
import DnDLoadSampleChanger from './dndloadsamplechanger';
import TableLoadSampleChanger from './tableloadsamplechanger';
import { useRef } from 'react';

export default function LoadSampleChanger({
  dewars,
  proposalName,
  setContainerLocation,
}: {
  dewars?: ContainerDewar[];
  proposalName: string;
  // eslint-disable-next-line no-unused-vars
  setContainerLocation: (
    containerId: number,
    beamline: string | undefined,
    position: string | undefined
  ) => void;
}) {
  const beamlines = useBeamlinesObjects('MX');

  const ref = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (document.fullscreenElement === ref.current) {
      document.exitFullscreen();
    } else {
      ref.current?.requestFullscreen();
    }
  };

  return (
    <div>
      <Tab.Container defaultActiveKey="visual">
        <Card
          ref={ref}
          style={{
            height: '100%',
          }}
        >
          <Card.Header style={{ paddingBottom: 0 }}>
            <Row>
              <Col xs="auto">
                <h6 style={{ margin: 5 }}>2. Load sample changer</h6>
              </Col>
              <Col xs={'auto'}>
                <Button onClick={toggleFullscreen} size="sm">
                  Fullscreen
                </Button>
              </Col>
              <Col></Col>
              <Col xs="auto">
                <Nav className="tabs-loadsamplechanger" variant="tabs">
                  <Nav.Item>
                    <Nav.Link eventKey="visual">Visual</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="table">Table</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body
            style={{
              padding: 0,
              paddingTop: 0,
              height: 'calc(100vh - 200px)',
              overflow: 'auto',
            }}
          >
            <Tab.Content
              style={{
                height: '100%',
              }}
            >
              <Tab.Pane
                eventKey="visual"
                style={{
                  height: '100%',
                }}
              >
                <DnDLoadSampleChanger
                  beamlines={beamlines}
                  setContainerLocation={setContainerLocation}
                  proposalName={proposalName}
                  dewars={dewars}
                ></DnDLoadSampleChanger>
              </Tab.Pane>
              <Tab.Pane eventKey="table">
                <TableLoadSampleChanger
                  beamlines={beamlines}
                  setContainerLocation={setContainerLocation}
                  proposalName={proposalName}
                  dewars={dewars}
                ></TableLoadSampleChanger>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </div>
  );
}
