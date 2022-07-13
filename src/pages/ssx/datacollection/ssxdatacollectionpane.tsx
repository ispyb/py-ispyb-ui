import moment from 'moment';
import { Tab, Card, Container, Row, Col, Badge, Nav } from 'react-bootstrap';
import { SSXDataCollectionResponse } from '../model';
import SSXDataCollectionExperiment from './datacollectionexperiment';
import SSXDataCollectionProcessing from './datacollectionprocessing';
import SSXDataCollectionSample from './datacollectionsample';
import SSXDataCollectionSummary from './datacollectionsummary';

export default function SSXDataCollectionPane({ dc }: { dc: SSXDataCollectionResponse }) {
  return (
    <div style={{ margin: 5 }}>
      <Tab.Container defaultActiveKey="Summary">
        <Card className="themed-card card-datacollectiongroup-panel">
          <Card.Header>
            <Container fluid>
              <Row>
                <Col md="auto">
                  <h5>
                    {moment(dc.DataCollection.startTime, 'MMMM Do YYYY, h:mm:ss A').format('DD/MM/YYYY HH:mm:ss')}
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
                <SSXDataCollectionSummary dc={dc}></SSXDataCollectionSummary>
              </Tab.Pane>
              <Tab.Pane eventKey="Sample" title="Sample">
                <SSXDataCollectionSample dc={dc}></SSXDataCollectionSample>
              </Tab.Pane>
              <Tab.Pane eventKey="Processing" title="Processing">
                <SSXDataCollectionProcessing dc={dc}></SSXDataCollectionProcessing>
              </Tab.Pane>
              <Tab.Pane eventKey="Experiment" title="Experiment details">
                <SSXDataCollectionExperiment dc={dc}></SSXDataCollectionExperiment>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </div>
  );
}
