import LazyWrapper from 'components/loading/lazywrapper';
import LoadingPanel from 'components/loading/loadingpanel';
import { formatDateToDayAndTime } from 'helpers/dateparser';
import { SessionResponse } from 'pages/model';

import { Tab, Card, Container, Row, Col, Badge, Nav } from 'react-bootstrap';
import { SSXDataCollectionResponse } from '../model';
import SSXDataCollectionBeamlineParams from './datacollectionbeamlineparams';
import SSXDataCollectionExperiment from './datacollectionexperiment';
import SSXDataCollectionProcessing from './datacollectionprocessing';
import SSXDataCollectionSample from './datacollectionsample';
import SSXDataCollectionSummary from './datacollectionsummary';

export default function SSXDataCollectionPane({ dc, session }: { dc: SSXDataCollectionResponse; session?: SessionResponse }) {
  return (
    <div style={{ margin: 5 }}>
      <Tab.Container defaultActiveKey="Summary">
        <Card className="themed-card card-datacollectiongroup-panel">
          <Card.Header>
            <Container fluid>
              <Row>
                <Col md="auto">
                  <h5>
                    {formatDateToDayAndTime(dc.DataCollection.startTime)}
                    <Badge bg="info">{dc.DataCollection.experimentType}</Badge>
                  </h5>
                </Col>
                <Col></Col>
                <Col md="auto">
                  <Nav className="tabs-datacollectiongroup-panel" variant="tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="Summary">Summary</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Beamline">Beamline parameters</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Sample">Sample</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Processing">Processing</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Experiment">Experiment details</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
              </Row>
            </Container>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="Summary" title="Summary">
                <SSXDataCollectionSummary dc={dc}></SSXDataCollectionSummary>{' '}
              </Tab.Pane>
              <Tab.Pane eventKey="Sample" title="Sample">
                <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                  <SSXDataCollectionSample dc={dc}></SSXDataCollectionSample>
                </LazyWrapper>
              </Tab.Pane>
              <Tab.Pane eventKey="Processing" title="Processing">
                <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                  <SSXDataCollectionProcessing dc={dc}></SSXDataCollectionProcessing>
                </LazyWrapper>
              </Tab.Pane>
              <Tab.Pane eventKey="Experiment" title="Experiment details">
                <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                  <SSXDataCollectionExperiment dc={dc}></SSXDataCollectionExperiment>
                </LazyWrapper>
              </Tab.Pane>
              <Tab.Pane eventKey="Beamline" title="Beamline parameters">
                <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                  <SSXDataCollectionBeamlineParams dc={dc} session={session}></SSXDataCollectionBeamlineParams>
                </LazyWrapper>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </div>
  );
}
