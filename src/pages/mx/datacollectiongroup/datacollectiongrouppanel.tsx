import React from 'react';
import { Card, Tab, Row, Col, Nav, Container } from 'react-bootstrap';

import { DataCollectionGroup } from 'pages/mx/model';
import SummaryDataCollectionGroupPanel from 'pages/mx/datacollectiongroup/summarydatacollectiongroup/summarydatacollectiongrouppanel';
import BeamlineDataCollectionGroupPanel from 'pages/mx/datacollectiongroup/beamline/beamlinedatacollectiongrouppanel';
import './datacollectiongrouppanel.css';

type Props = {
  sessionId: string;
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
};

export default function DataCollectionGroupPanel({ proposalName, dataCollectionGroup }: Props) {
  return (
    <Tab.Container defaultActiveKey="Summary">
      <Card className="card-datacollectiongroup-panel">
        <Card.Header>
          <Container fluid>
            <Row>
              <Col md="auto">
                <h5>
                  {dataCollectionGroup.startTimeList?.split(',')[0]} - {dataCollectionGroup.DataCollectionGroup_experimentType}
                </h5>
              </Col>
              <Col></Col>
              <Col md="auto">
                <Nav className="tabs-datacollectiongroup-panel" variant="tabs">
                  <Nav.Item>
                    <Nav.Link eventKey="Summary">Summary</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Beamline">Beamline Parameters</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Data">Data Collections</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Sample">Sample</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Results">Results</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Workflow">Workflow</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>
          </Container>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            <Tab.Pane eventKey="Summary" title="Summary">
              <SummaryDataCollectionGroupPanel proposalName={proposalName} dataCollectionGroup={dataCollectionGroup}></SummaryDataCollectionGroupPanel>
            </Tab.Pane>
            <Tab.Pane eventKey="Beamline" title="Beamline Parameters">
              <BeamlineDataCollectionGroupPanel dataCollectionGroup={dataCollectionGroup}></BeamlineDataCollectionGroupPanel>
            </Tab.Pane>
            <Tab.Pane eventKey="Data" title="Data Collections">
              <p>TODO</p>
            </Tab.Pane>
            <Tab.Pane eventKey="Sample" title="Sample">
              <p>TODO</p>
            </Tab.Pane>
            <Tab.Pane eventKey="Results" title="Results">
              <p>TODO</p>
            </Tab.Pane>
            <Tab.Pane eventKey="Workflow" title="Workflow">
              <p>TODO</p>
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Card>
    </Tab.Container>
  );
}
