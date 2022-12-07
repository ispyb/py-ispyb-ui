import { ContainerDewar } from 'legacy/pages/model';
import { Card, Tab, Col, Row, Nav } from 'react-bootstrap';

import './loadsamplechanger.scss';

import { useBeamlinesObjects } from 'legacy/hooks/site';
import DnDLoadSampleChanger from './dndloadsamplechanger';
import TableLoadSampleChanger from './tableloadsamplechanger';

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

  return (
    <Tab.Container defaultActiveKey="visual">
      <Card>
        <Card.Header style={{ paddingBottom: 0 }}>
          <Row>
            <Col md="auto">
              <h6 style={{ margin: 5 }}>2. Load sample changer</h6>
            </Col>
            <Col></Col>
            <Col md="auto">
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
        <Card.Body style={{ padding: 0, paddingTop: 20 }}>
          <Tab.Content>
            <Tab.Pane eventKey="visual">
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
  );
}
