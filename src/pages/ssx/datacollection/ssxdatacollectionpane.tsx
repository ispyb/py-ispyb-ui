import LazyWrapper from 'components/loading/lazywrapper';
import LoadingPanel from 'components/loading/loadingpanel';
import { formatDateToDayAndTime } from 'helpers/dateparser';
import { SessionResponse } from 'pages/model';

import { Tab, Card, Container, Row, Col, Badge, Nav } from 'react-bootstrap';
import { SSXDataCollectionResponse } from '../model';
import SSXDataCollectionParams from './datacollectionparams';
import SSXDataCollectionProcessing from './datacollectionprocessing';
import SSXDataCollectionSample from './datacollectionsample';
import SSXDataCollectionSummary from './datacollectionsummary';
import SSXDataCollectionSequence from './datacollectionsequence';

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
                    <Badge bg="info">{dc.DataCollection.DataCollectionGroup.experimentType}</Badge>
                  </h5>
                </Col>
                <Col></Col>
                <Col md="auto">
                  <Nav className="tabs-datacollectiongroup-panel" variant="tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="Summary">Summary</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Parameters">Parameters</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Sample">Sample</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Sequence">Sequence</Nav.Link>
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
              <Tab.Pane eventKey="Sequence" title="Sequence">
                <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                  <SSXDataCollectionSequence dc={dc}></SSXDataCollectionSequence>
                </LazyWrapper>
              </Tab.Pane>
              <Tab.Pane eventKey="Parameters" title="Parameters">
                <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                  <SSXDataCollectionParams dc={dc} session={session}></SSXDataCollectionParams>
                </LazyWrapper>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </div>
  );
}
