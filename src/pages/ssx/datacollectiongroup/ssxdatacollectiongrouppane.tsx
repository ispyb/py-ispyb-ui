import LazyWrapper from 'components/loading/lazywrapper';
import LoadingPanel from 'components/loading/loadingpanel';
import { formatDateToDayAndTime } from 'helpers/dateparser';
import { SessionResponse } from 'pages/model';

import { Tab, Card, Container, Row, Col, Badge, Nav, Button } from 'react-bootstrap';
import { DataCollectionGroupResponse } from '../model';
import SSXDataCollectionGroupSample from './datacollectiongroupsample';

export default function SSXDataCollectionGroupPane({ dcg, session, proposalName }: { dcg: DataCollectionGroupResponse; session: SessionResponse; proposalName: string }) {
  return (
    <div style={{ margin: 5 }}>
      <Tab.Container defaultActiveKey="Sample">
        <Card className="themed-card card-datacollectiongroup-panel">
          <Card.Header>
            <Container fluid>
              <Row>
                <Col md="auto">
                  <h5>
                    {formatDateToDayAndTime(dcg.startTime)}
                    <Badge bg="info">{dcg.experimentType}</Badge>
                  </h5>
                </Col>
                <Col></Col>
                <Col md="auto">
                  <Nav className="tabs-datacollectiongroup-panel" variant="tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="Sample">Sample</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Processing">Processing</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
              </Row>
            </Container>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={'auto'} style={{ display: 'flex' }}>
                <Button
                  style={{ display: 'flex', alignItems: 'center', height: '100%', width: 120, borderRadius: 0, borderRight: '1px solid lightgrey' }}
                  variant="secondary"
                  href={`/${proposalName}/SSX/${session.sessionId}/${dcg.dataCollectionGroupId}`}
                >
                  <p>Monitor experiment</p>
                </Button>
              </Col>
              <Col>
                <Tab.Content>
                  <Tab.Pane eventKey="Sample" title="Sample">
                    <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                      <SSXDataCollectionGroupSample dcg={dcg}></SSXDataCollectionGroupSample>
                    </LazyWrapper>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Processing" title="Sequence">
                    <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                      <></>
                    </LazyWrapper>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Tab.Container>
    </div>
  );
}
