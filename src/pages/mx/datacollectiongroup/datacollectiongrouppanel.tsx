import React, { Suspense } from 'react';
import { Card, Tab, Row, Col, Nav, Container, Badge } from 'react-bootstrap';

import { DataCollectionGroup } from 'pages/mx/model';
import SummaryDataCollectionGroupPanel from 'pages/mx/datacollectiongroup/summarydatacollectiongroup/summarydatacollectiongrouppanel';
import BeamlineDataCollectionGroupPanel from 'pages/mx/datacollectiongroup/beamline/beamlinedatacollectiongrouppanel';
import './datacollectiongrouppanel.css';
import CollectionsDataCollectionGroupPanel from './collections/collectionsdatacollectiongrouppanel';
import LoadingPanel from 'components/loading/loadingpanel';
import LazyWrapper from 'components/loading/lazywrapper';
import _ from 'lodash';
import SampleDataCollectionGroupPanel from './sample/sampledatacollectiongrouppanel';
import UI from 'config/ui';
import WorkflowDataCollectionGroupPanel from './workflow/workflowdatacollectiongrouppanel';

type Props = {
  sessionId: string;
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
};

function getUniqueCount(commaSeparatedList?: string): number {
  if (commaSeparatedList) {
    const splitted = commaSeparatedList.split(',');
    return _.uniq(splitted).length;
  }
  return 0;
}

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
                  {UI.MX.showCollectionTab && (
                    <Nav.Item>
                      <Nav.Link eventKey="Data">
                        Data Collections
                        <Badge bg="info">{dataCollectionGroup.totalNumberOfDataCollections}</Badge>
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  <Nav.Item>
                    <Nav.Link eventKey="Sample">Sample</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Results">
                      Results
                      <Badge bg="info">{getUniqueCount(dataCollectionGroup.autoProcIntegrationId)}</Badge>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Workflow">
                      Workflow
                      <Badge bg="info">{getUniqueCount(dataCollectionGroup.WorkflowStep_workflowStepId)}</Badge>
                    </Nav.Link>
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
              <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                <BeamlineDataCollectionGroupPanel dataCollectionGroup={dataCollectionGroup}></BeamlineDataCollectionGroupPanel>
              </LazyWrapper>
            </Tab.Pane>
            {UI.MX.showCollectionTab && (
              <Tab.Pane eventKey="Data" title="Data Collections">
                <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                  <Suspense fallback={<LoadingPanel></LoadingPanel>}>
                    <CollectionsDataCollectionGroupPanel dataCollectionGroup={dataCollectionGroup}></CollectionsDataCollectionGroupPanel>
                  </Suspense>
                </LazyWrapper>
              </Tab.Pane>
            )}
            <Tab.Pane eventKey="Sample" title="Sample">
              <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                <SampleDataCollectionGroupPanel dataCollectionGroup={dataCollectionGroup}></SampleDataCollectionGroupPanel>
              </LazyWrapper>
            </Tab.Pane>
            <Tab.Pane eventKey="Results" title="Results">
              <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                <p>TODO</p>
              </LazyWrapper>
            </Tab.Pane>
            <Tab.Pane eventKey="Workflow" title="Workflow">
              <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                <WorkflowDataCollectionGroupPanel proposalName={proposalName} dataCollectionGroup={dataCollectionGroup}></WorkflowDataCollectionGroupPanel>
              </LazyWrapper>
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Card>
    </Tab.Container>
  );
}
