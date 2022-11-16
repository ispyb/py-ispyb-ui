import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ZoomImage from 'components/image/zoomimage';
import LoadingPanel from 'components/loading/loadingpanel';
import { DefaultLoadingPanel } from 'components/loading/loadingpanel.stories';
import { formatDateToDayAndTime, parseDate } from 'helpers/dateparser';
import { useEventsDataCollectionGroup, useSample, useSSXDataCollectionProcessingStats } from 'hooks/pyispyb';
import { random, round } from 'lodash';
import { SessionResponse } from 'pages/model';
import { Suspense, useState } from 'react';

import { Tab, Card, Container, Row, Col, Nav, Button, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import SSXDataCollectionSummary from '../datacollection/datacollectionsummary';
import { Event, DataCollection } from 'models/Event';
import { SSXDataCollectionProcessingStats } from 'models/SSXDataCollectionProcessingStats';
import { getColorFromHitPercent } from 'helpers/ssx';
import SSXDataCollectionGroupParameters from './ssxdatacollectiongroupparameters';
import LazyWrapper from 'components/loading/lazywrapper';
import { DataCollectionGroupHitGraph, HitsStatisticsCumulative } from '../statistics/hits';
import { UnitCellStatistics } from '../statistics/cells';

export default function SSXDataCollectionGroupPane({
  dcg,
  session,
  proposalName,
  deployed,
  onDeploy,
}: {
  dcg: Event;
  session: SessionResponse;
  proposalName: string;
  deployed: boolean;
  onDeploy: () => void;
}) {
  if (!dcg.count) return null;
  return (
    <div style={{ margin: 5, cursor: deployed ? undefined : 'pointer' }} onClick={onDeploy}>
      <Tab.Container defaultActiveKey="Summary">
        <Card className="themed-card card-datacollectiongroup-panel">
          <Card.Header>
            <Container fluid>
              <Row>
                {deployed && (
                  <Col md="auto">
                    <Nav className="tabs-datacollectiongroup-panel" variant="tabs">
                      <Nav.Item>
                        <Nav.Link eventKey="Summary">Summary</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="Parameters">Parameters</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                )}
                <Col md="auto">
                  <h5>{dcg.startTime && formatDateToDayAndTime(dcg.startTime)}</h5>
                </Col>
              </Row>
            </Container>
          </Card.Header>
          <Card.Body>
            <Row>
              {!deployed && (
                <Col style={{ display: 'flex' }} md={'auto'}>
                  <OverlayTrigger key={'right'} placement={'right'} overlay={<Tooltip id={`tooltip-right`}>{'Expand'}</Tooltip>}>
                    <Button style={{ backgroundColor: '#00000008', borderRadius: 0, borderRight: '1px solid lightgrey' }} variant="link" onClick={onDeploy}>
                      <FontAwesomeIcon color="grey" icon={faPlusSquare} />
                    </Button>
                  </OverlayTrigger>
                </Col>
              )}
              <Col>
                <Suspense
                  fallback={
                    <Row>
                      <Col></Col>
                      <Col md={'auto'}>
                        <Spinner animation="border" />
                      </Col>
                      <Col></Col>
                    </Row>
                  }
                >
                  <CompactDataCollectionGroupContent dcg={dcg} session={session} proposalName={proposalName}></CompactDataCollectionGroupContent>
                </Suspense>
                {deployed && (
                  <Suspense fallback={DefaultLoadingPanel}>
                    <DataCollectionGroupContent dcg={dcg} session={session} proposalName={proposalName}></DataCollectionGroupContent>
                  </Suspense>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Tab.Container>
    </div>
  );
}

function CompactDataCollectionGroupContent({ dcg }: { dcg: Event; session: SessionResponse; proposalName: string }) {
  const { data: sample } = useSample({ blSampleId: dcg.blSampleId ? dcg.blSampleId : 0 });

  if (sample == undefined) return null;

  if (!('DataCollectionGroup' in dcg.Item)) {
    return null;
  }

  const fields = [
    { label: 'Protein', value: sample.Crystal.Protein.acronym },
    { label: 'Sample', value: sample.name },
    { label: 'Sample support', value: dcg.Item.DataCollectionGroup.experimentType },
    { label: 'Experiment name', value: dcg.Item.SSXDataCollection?.experimentName },
    { label: '# Runs', value: dcg.count },
    { label: '# Hits (total)', value: random(0, 100000) },
    { label: '# Indexed  (total)', value: random(0, 100000) },
  ];
  return (
    <Row>
      {fields.map((field) => {
        return (
          <Col key={field.label} md={'auto'}>
            <Card style={{ padding: 5, margin: 5 }}>
              <h5 className="text-center" style={{ padding: 0, margin: 0 }}>
                <small>{field.label} :</small> <strong>{field.value}</strong>
              </h5>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}

function DataCollectionGroupContent({ dcg, session, proposalName }: { dcg: Event; session: SessionResponse; proposalName: string }) {
  const { data: sample } = useSample({ blSampleId: dcg.blSampleId ? dcg.blSampleId : 0 });

  if (sample == undefined) return null;

  if (!('DataCollectionGroup' in dcg.Item)) {
    return null;
  }

  return (
    <Row>
      <Tab.Content>
        <Tab.Pane eventKey="Summary" title="Summary">
          <DataCollectionGroupSummary dcg={dcg.Item} session={session} proposalName={proposalName}></DataCollectionGroupSummary>
        </Tab.Pane>
        <Tab.Pane eventKey="Parameters" title="Parameters">
          <Suspense fallback={DefaultLoadingPanel}>
            <SSXDataCollectionGroupParameters dcg={dcg} session={session}></SSXDataCollectionGroupParameters>
          </Suspense>
        </Tab.Pane>
      </Tab.Content>
    </Row>
  );
}

function DataCollectionGroupSummary({ dcg }: { dcg: DataCollection; session: SessionResponse; proposalName: string }) {
  const { data: dcsData, isError: dcsError } = useEventsDataCollectionGroup({ dataCollectionGroupId: dcg.DataCollectionGroup.dataCollectionGroupId });

  if (dcsError) throw Error(dcsError);

  if (!dcsData?.results) return null;

  const dcs = dcsData.results.sort((a, b) => parseDate(a.startTime).getTime() - parseDate(b.startTime).getTime());

  return (
    <Col>
      <Row>
        <h4 className="text-center" style={{ margin: 10 }}>
          Cumulative summary
        </h4>
      </Row>
      <Row className="flex-nowrap" style={{ overflowX: 'auto', margin: 10 }}>
        <Suspense fallback={DefaultLoadingPanel}>
          <Col md={'auto'}>
            <ZoomImage style={{ maxWidth: 400 }} src="/images/temp/max.png"></ZoomImage>
          </Col>
          <Col md={'auto'}>
            <Suspense fallback={<LoadingPanel></LoadingPanel>}>
              <HitsStatisticsCumulative dcs={dcs}></HitsStatisticsCumulative>
            </Suspense>
          </Col>
          <Col md={'auto'}>
            <Suspense fallback={<LoadingPanel></LoadingPanel>}>
              <DataCollectionGroupHitGraph dcs={dcs}></DataCollectionGroupHitGraph>
            </Suspense>
          </Col>
          <Col md={'auto'}>
            <LazyWrapper>
              <Suspense fallback={<LoadingPanel></LoadingPanel>}>
                <UnitCellStatistics dcIds={dcsData.results.map((dc) => dc.id)}></UnitCellStatistics>
              </Suspense>
            </LazyWrapper>
          </Col>
        </Suspense>
      </Row>
      <Suspense fallback={<LoadingPanel></LoadingPanel>}>
        <DataCollectionGroupRunSummary dcs={dcs}></DataCollectionGroupRunSummary>
      </Suspense>
    </Col>
  );
}

function DataCollectionGroupRunSummary({ dcs }: { dcs: Event[] }) {
  const { data: stats, isError: statsError } = useSSXDataCollectionProcessingStats({ datacollectionIds: dcs.map((r) => r.id) });
  const [selected, setSelected] = useState(0);

  if (statsError) throw Error(statsError);

  const selectedDc = dcs[selected];

  return (
    <Row style={{ margin: 20, padding: 0, backgroundColor: '#d3d3d36b', border: '1px solid lightgray', borderRadius: 10 }}>
      <Col md={'auto'} style={{ margin: 0, marginRight: 20, padding: 0, display: 'flex' }}>
        <div style={{ overflowY: 'auto', borderRight: '1px solid lightgray', borderRadius: '10px 0px 0px 10px', margin: 0, backgroundColor: '#345a8c8a' }}>
          <div
            className="text-center"
            style={{
              margin: 0,
              marginBottom: -1,
              padding: 0,
              border: '1px solid lightgray',
              backgroundColor: '#3498db',
            }}
          >
            <span style={{ margin: 5, color: 'white', fontSize: 15 }}>
              <strong>Run #</strong>
            </span>
          </div>
          {dcs.map((dc, index) => {
            const item = dcs[index].Item;
            if ('DataCollectionGroup' in item) {
              return <RunNumberTab key={index} dc={item} selected={selected == index} onClick={() => setSelected(index)} stats={stats} number={index + 1} />;
            } else {
              return <RunNumberTab key={index} dc={undefined} selected={selected == index} onClick={() => setSelected(index)} stats={stats} number={index + 1} />;
            }
          })}
        </div>
      </Col>
      <Col style={{ margin: 0, padding: 0 }}>
        <Row>
          <h4 className="text-center" style={{ margin: 10 }}>
            Run #{selected + 1} summary ({selectedDc.startTime ? formatDateToDayAndTime(selectedDc.startTime) : ''})
          </h4>
        </Row>
        <Row>
          {'DataCollectionGroup' in selectedDc.Item && (
            <Suspense fallback={DefaultLoadingPanel}>
              <SSXDataCollectionSummary dc={selectedDc.Item}></SSXDataCollectionSummary>
            </Suspense>
          )}
        </Row>
      </Col>
    </Row>
  );
}

function RunNumberTab({
  onClick,
  stats = [],
  selected,
  number,
  dc,
}: {
  onClick: () => void;
  stats: SSXDataCollectionProcessingStats[] | undefined;
  selected: boolean;
  number: number;
  dc: DataCollection | undefined;
}) {
  const statsFiltered = stats.filter((s) => dc && s.dataCollectionId == dc.dataCollectionId);
  const stat = statsFiltered.length ? statsFiltered[0] : undefined;
  let color = selected ? 'white' : undefined;
  if (stat && dc && dc.numberOfImages) {
    const hitPercent = round((stat.nbHits / dc.numberOfImages) * 100, 2);
    color = getColorFromHitPercent(hitPercent);
  }

  return (
    <div
      onClick={onClick}
      className="text-center"
      style={{
        cursor: 'pointer',
        margin: 0,
        marginBottom: -1,
        padding: 0,
        border: '1px solid lightgray',

        backgroundColor: selected ? '#345a8c' : '#f5f5f5',
      }}
    >
      <span style={{ margin: 5, color: color }}>
        <strong>#{number}</strong>
      </span>
    </div>
  );
}
