import {
  Card,
  Tab,
  Row,
  Col,
  Nav,
  Container,
  Badge,
  Spinner,
  DropdownButton,
} from 'react-bootstrap';

import { DataCollectionGroup } from 'legacy/pages/mx/model';
import CollectionsDataCollectionGroupPanel from '../collections/collectionsdatacollectiongrouppanel';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import _ from 'lodash';
import UI from 'legacy/config/ui';
import moment from 'moment';
import NbBadge from 'legacy/components/nbBadge';
import { useAutoProc } from 'legacy/hooks/ispyb';
import { parseResults } from 'legacy/helpers/mx/results/resultparser';
import MRTab from './phasing/phasingTab';
import { HashAnchorButton, useHashScroll } from 'hooks/hashScroll';
import BeamlineDataCollectionGroupPanel from '../beamline/beamlinedatacollectiongrouppanel';
import ProcessingSummary from './results/processingSummary';
import ResultsDataCollectionGroupPanel from './results/ResultsDataCollectionGroupPanel';
import SampleDataCollectionGroupPanel from './sample/sampledatacollectiongrouppanel';
import WorkflowDataCollectionGroupPanel from './workflow/workflowdatacollectiongrouppanel';
import { useAutoProcRanking, usePipelines } from 'hooks/mx';
import { SummaryDataCollectionGroupPanel } from './summary/SummaryDataCollectionGroupPanel';
import Loading from 'components/Loading';
import { useState } from 'react';

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

export function DataCollectionGroupPanel({
  proposalName,
  dataCollectionGroup,
}: Props) {
  const ranking = useAutoProcRanking();
  const pipelines = usePipelines();
  const [currentTab, setCurrentTab] = useState('Summary');

  const hashscroll = useHashScroll(
    `dcg-${dataCollectionGroup.DataCollectionGroup_dataCollectionGroupId}`
  );

  if (dataCollectionGroup.DataCollection_dataCollectionId === undefined)
    return null;

  const getBadge = () => {
    if (dataCollectionGroup.Workflow_workflowType)
      return dataCollectionGroup.Workflow_workflowType;
    if (dataCollectionGroup.DataCollectionGroup_experimentType === 'OSC')
      return 'Dataset';
    return dataCollectionGroup.DataCollectionGroup_experimentType;
  };

  const navItems = (
    <>
      <Nav.Item>
        <Nav.Link eventKey="Summary">Summary</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="Beamline Parameters">Beamline Parameters</Nav.Link>
      </Nav.Item>
      {UI.MX.showCollectionTab && (
        <Nav.Item>
          <Nav.Link eventKey="Acquisitions">
            Acquisitions
            <NbBadge value={dataCollectionGroup.totalNumberOfDataCollections} />
          </Nav.Link>
        </Nav.Item>
      )}
      <Nav.Item>
        <Nav.Link eventKey="Sample">Sample</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          eventKey="Autoprocessing"
          style={{
            display: 'flex',
          }}
        >
          Autoprocessing
          <LazyWrapper>
            <AutoprocNbBadge
              dataCollectionGroup={dataCollectionGroup}
              proposalName={proposalName}
              selectedPipelines={pipelines.pipelines}
            />
          </LazyWrapper>
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
      {dataCollectionGroup.hasMR || dataCollectionGroup.hasPhasing ? (
        <Nav.Item>
          <Nav.Link eventKey="Phasing">
            Phasing
            <NbBadge
              value={
                Number(dataCollectionGroup.hasMR || '0') +
                Number(dataCollectionGroup.hasPhasing || '0')
              }
            />
          </Nav.Link>
        </Nav.Item>
      ) : null}
    </>
  );

  return (
    <Tab.Container
      activeKey={currentTab}
      onSelect={(v) => {
        v && setCurrentTab(v);
      }}
    >
      <Card
        className="themed-card card-datacollectiongroup-panel"
        ref={hashscroll.ref}
        style={{
          backgroundColor: hashscroll.isCurrent ? '#edf2ff' : undefined,
        }}
      >
        <Card.Header
          style={{
            padding: 0,
            paddingTop: 5,
          }}
        >
          <Container fluid>
            <Row>
              <Col xs={'auto'}>
                <HashAnchorButton hash={hashscroll.hash} />
              </Col>
              <Col xs="auto">
                <h5>
                  {moment(
                    dataCollectionGroup.DataCollectionGroup_startTime,
                    'MMMM Do YYYY, h:mm:ss A'
                  ).format('DD/MM/YYYY HH:mm:ss')}
                  <Badge bg="info">{getBadge()}</Badge>
                </h5>
              </Col>
              <Col
                className="d-none d-lg-flex"
                style={{
                  justifyContent: 'flex-end',
                  flexWrap: 'nowrap',
                }}
              >
                <Nav className="tabs-datacollectiongroup-panel" variant="tabs">
                  {navItems}
                </Nav>
              </Col>
              <Col
                style={{
                  justifyContent: 'flex-end',
                  flexWrap: 'nowrap',
                }}
                className="d-flex d-lg-none"
              >
                <Nav>
                  <DropdownButton size="sm" variant="dark" title={currentTab}>
                    {navItems}
                  </DropdownButton>
                </Nav>
              </Col>
            </Row>
          </Container>
        </Card.Header>
        <Card.Body>
          <Row className="flex-nowrap">
            <Col
              style={{
                marginLeft: 0,
                marginRight: 12,
                marginTop: 10,
                padding: 10,
                overflowX: 'auto',
              }}
            >
              <Container fluid>
                <Tab.Content>
                  <Tab.Pane eventKey="Summary">
                    <SummaryDataCollectionGroupPanel
                      proposalName={proposalName}
                      dataCollectionGroup={dataCollectionGroup}
                      selectedPipelines={pipelines.pipelines}
                      resultRankParam={ranking.rankParam}
                      resultRankShell={ranking.rankShell}
                    ></SummaryDataCollectionGroupPanel>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Beamline Parameters">
                    <LazyWrapper placeholder={<Loading />}>
                      <BeamlineDataCollectionGroupPanel
                        dataCollectionGroup={dataCollectionGroup}
                      ></BeamlineDataCollectionGroupPanel>
                    </LazyWrapper>
                  </Tab.Pane>
                  {UI.MX.showCollectionTab && (
                    <Tab.Pane eventKey="Acquisitions">
                      <LazyWrapper placeholder={<Loading />}>
                        <CollectionsDataCollectionGroupPanel
                          dataCollectionGroup={dataCollectionGroup}
                        ></CollectionsDataCollectionGroupPanel>
                      </LazyWrapper>
                    </Tab.Pane>
                  )}
                  <Tab.Pane eventKey="Sample">
                    <LazyWrapper placeholder={<Loading />}>
                      <SampleDataCollectionGroupPanel
                        dataCollectionGroup={dataCollectionGroup}
                      ></SampleDataCollectionGroupPanel>
                    </LazyWrapper>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Autoprocessing">
                    <LazyWrapper placeholder={<Loading />}>
                      <ResultsDataCollectionGroupPanel
                        proposalName={proposalName}
                        dataCollectionGroup={dataCollectionGroup}
                        selectedPipelines={pipelines.pipelines}
                        resultRankParam={ranking.rankParam}
                        resultRankShell={ranking.rankShell}
                      />
                    </LazyWrapper>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Workflow" title="Workflow">
                    <LazyWrapper placeholder={<Loading />}>
                      <WorkflowDataCollectionGroupPanel
                        proposalName={proposalName}
                        dataCollectionGroup={dataCollectionGroup}
                      ></WorkflowDataCollectionGroupPanel>
                    </LazyWrapper>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Phasing" title="Phasing">
                    <LazyWrapper placeholder={<Loading />}>
                      <MRTab
                        proposalName={proposalName}
                        dataCollectionGroup={dataCollectionGroup}
                      ></MRTab>
                    </LazyWrapper>
                  </Tab.Pane>
                </Tab.Content>
              </Container>
            </Col>
          </Row>
        </Card.Body>
        {dataCollectionGroup.processingStatus?.trim().length && (
          <Card.Footer>
            <LazyWrapper
              height={60}
              placeholder={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              }
            >
              <ProcessingSummary
                proposalName={proposalName}
                dataCollectionGroup={dataCollectionGroup}
              />
            </LazyWrapper>
          </Card.Footer>
        )}
      </Card>
    </Tab.Container>
  );
}

function AutoprocNbBadge({
  dataCollectionGroup,
  proposalName,
  selectedPipelines,
}: {
  dataCollectionGroup: DataCollectionGroup;
  proposalName: string;
  selectedPipelines: string[];
}) {
  const { data: procs } = useAutoProc({
    proposalName,
    dataCollectionId:
      dataCollectionGroup.DataCollection_dataCollectionId?.toString() || '-1',
  });
  const pipelines = parseResults(procs?.flatMap((v) => v) || []).filter(
    (v) =>
      selectedPipelines.includes(v.program) || selectedPipelines.length === 0
  );
  return (
    <NbBadge value={pipelines.filter((p) => p.status === 'SUCCESS').length} />
  );
}
