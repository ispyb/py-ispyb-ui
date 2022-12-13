import { Suspense, useState } from 'react';
import {
  OverlayTrigger,
  Tooltip,
  Card,
  Tab,
  Row,
  Col,
  Nav,
  Container,
  Badge,
  Button,
} from 'react-bootstrap';

import { DataCollectionGroup } from 'legacy/pages/mx/model';
import SummaryDataCollectionGroupPanel from 'legacy/pages/mx/datacollectiongroup/summarydatacollectiongroup/summarydatacollectiongrouppanel';
import BeamlineDataCollectionGroupPanel from 'legacy/pages/mx/datacollectiongroup/beamline/beamlinedatacollectiongrouppanel';
import './datacollectiongrouppanel.scss';
import CollectionsDataCollectionGroupPanel from './collections/collectionsdatacollectiongrouppanel';
import LoadingPanel from 'legacy/components/loading/loadingpanel';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import _ from 'lodash';
import SampleDataCollectionGroupPanel from './sample/sampledatacollectiongrouppanel';
import UI from 'legacy/config/ui';
import WorkflowDataCollectionGroupPanel from './workflow/workflowdatacollectiongrouppanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import moment from 'moment';
import NbBadge from 'legacy/components/nbBadge';
import ResultsDataCollectionGroupPanel from './results/ResultsDataCollectionGroupPanel';

type Props = {
  sessionId: string;
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
  defaultCompact: boolean;
  compactToggle: Subject<boolean>;
};

function getUniqueCount(commaSeparatedList?: string): number {
  if (commaSeparatedList) {
    const splitted = commaSeparatedList.split(',');
    return _.uniq(splitted).length;
  }
  return 0;
}

export default function DataCollectionGroupPanel({
  proposalName,
  dataCollectionGroup,
  defaultCompact,
  compactToggle,
}: Props) {
  const [compact, setCompact] = useState(defaultCompact);
  compactToggle.subscribe({
    next: (value) => {
      setCompact(value);
    },
  });

  return (
    <Tab.Container
      activeKey={compact ? 'Summary' : undefined}
      defaultActiveKey="Summary"
    >
      <Card className="themed-card card-datacollectiongroup-panel">
        <Card.Header style={compact ? { padding: 0 } : undefined}>
          {compact ? (
            <div style={{ height: 5 }}></div>
          ) : (
            <Container fluid>
              <Row>
                <Col md="auto">
                  <h5 style={compact ? { fontSize: 15, margin: 5 } : undefined}>
                    {moment(
                      dataCollectionGroup.DataCollectionGroup_startTime,
                      'MMMM Do YYYY, h:mm:ss A'
                    ).format('DD/MM/YYYY HH:mm:ss')}
                    <Badge bg="info">
                      {dataCollectionGroup.DataCollectionGroup_experimentType}
                    </Badge>
                  </h5>
                </Col>
                <Col></Col>
                <Col md="auto">
                  <Nav
                    className="tabs-datacollectiongroup-panel"
                    style={compact ? { fontSize: 10 } : undefined}
                    variant="tabs"
                  >
                    <Nav.Item>
                      <Nav.Link eventKey="Summary">Summary</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Beamline">
                        Beamline Parameters
                      </Nav.Link>
                    </Nav.Item>
                    {UI.MX.showCollectionTab && (
                      <Nav.Item>
                        <Nav.Link eventKey="Data">
                          Data Collections
                          <NbBadge
                            value={
                              dataCollectionGroup.totalNumberOfDataCollections
                            }
                          />
                        </Nav.Link>
                      </Nav.Item>
                    )}
                    <Nav.Item>
                      <Nav.Link eventKey="Sample">Sample</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Results">
                        Results
                        <NbBadge
                          value={getUniqueCount(
                            dataCollectionGroup.autoProcIntegrationId
                          )}
                        />
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="Workflow">
                        Workflow
                        <NbBadge
                          value={getUniqueCount(
                            dataCollectionGroup.WorkflowStep_workflowStepId
                          )}
                        />
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
              </Row>
            </Container>
          )}
        </Card.Header>
        <Card.Body>
          <Row className="flex-nowrap">
            <Col style={{ display: 'flex' }} xs={'auto'}>
              <OverlayTrigger
                key={'right'}
                placement={'right'}
                overlay={
                  <Tooltip id={`tooltip-right`}>
                    {compact ? 'Expand' : 'Minify'}
                  </Tooltip>
                }
              >
                <Button
                  style={{
                    backgroundColor: '#00000008',
                    borderRadius: 0,
                    borderRight: '1px solid lightgrey',
                  }}
                  variant="link"
                  onClick={() => {
                    setCompact(!compact);
                  }}
                >
                  <FontAwesomeIcon
                    color="grey"
                    icon={compact ? faAngleDown : faAngleUp}
                  />
                </Button>
              </OverlayTrigger>
            </Col>
            <Col
              style={
                compact
                  ? undefined
                  : {
                      marginLeft: 0,
                      marginRight: 12,
                      marginTop: 10,
                      padding: 10,
                      overflowX: 'auto',
                    }
              }
            >
              <Container fluid>
                <Tab.Content>
                  <Tab.Pane eventKey="Summary" title="Summary">
                    <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                      <Suspense fallback={<LoadingPanel></LoadingPanel>}>
                        <SummaryDataCollectionGroupPanel
                          compact={compact}
                          proposalName={proposalName}
                          dataCollectionGroup={dataCollectionGroup}
                        ></SummaryDataCollectionGroupPanel>
                      </Suspense>
                    </LazyWrapper>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Beamline" title="Beamline Parameters">
                    <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                      <BeamlineDataCollectionGroupPanel
                        dataCollectionGroup={dataCollectionGroup}
                      ></BeamlineDataCollectionGroupPanel>
                    </LazyWrapper>
                  </Tab.Pane>
                  {UI.MX.showCollectionTab && (
                    <Tab.Pane eventKey="Data" title="Data Collections">
                      <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                        <Suspense fallback={<LoadingPanel></LoadingPanel>}>
                          <CollectionsDataCollectionGroupPanel
                            dataCollectionGroup={dataCollectionGroup}
                          ></CollectionsDataCollectionGroupPanel>
                        </Suspense>
                      </LazyWrapper>
                    </Tab.Pane>
                  )}
                  <Tab.Pane eventKey="Sample" title="Sample">
                    <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                      <SampleDataCollectionGroupPanel
                        dataCollectionGroup={dataCollectionGroup}
                      ></SampleDataCollectionGroupPanel>
                    </LazyWrapper>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Results" title="Results">
                    <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                      <ResultsDataCollectionGroupPanel
                        proposalName={proposalName}
                        dataCollectionGroup={dataCollectionGroup}
                      />
                    </LazyWrapper>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Workflow" title="Workflow">
                    <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                      <WorkflowDataCollectionGroupPanel
                        proposalName={proposalName}
                        dataCollectionGroup={dataCollectionGroup}
                      ></WorkflowDataCollectionGroupPanel>
                    </LazyWrapper>
                  </Tab.Pane>
                </Tab.Content>
              </Container>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Tab.Container>
  );
}
