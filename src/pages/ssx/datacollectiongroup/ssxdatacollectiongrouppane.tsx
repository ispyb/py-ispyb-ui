import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ZoomImage from 'components/image/zoomimage';
import LoadingPanel from 'components/loading/loadingpanel';
import { DefaultLoadingPanel } from 'components/loading/loadingpanel.stories';
import { formatDateToDayAndTime } from 'helpers/dateparser';
import { useEventsDataCollectionGroup, useSample, useSSXDataCollectionProcessings } from 'hooks/pyispyb';
import { random } from 'lodash';
import { SessionResponse } from 'pages/model';
import { Suspense, useState } from 'react';

import { Tab, Card, Container, Row, Col, Nav, Button, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import { HitsStatistics, UnitCellStatistics } from '../datacollection/datacollectionsummary';
import SSXDataCollectionSummary from '../datacollection/datacollectionsummary';
import { Event, DataCollection } from 'models/Event';
import _ from 'lodash';
import PlotWidget from 'components/plotting/plotwidget';

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
                <Col md="auto">
                  <h5>{dcg.startTime && formatDateToDayAndTime(dcg.startTime)}</h5>
                </Col>
                <Col></Col>
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
  // const { data: dcs } = useSSXDataCollections(String(session.sessionId), String(dcg.dataCollectionGroupId));
  // const { data: sample } = useSSXDataCollectionGroupSample(dcg.dataCollectionGroupId);
  // const { data: sequences } = useSSXDataCollectionSequences(dcs && dcs[0] ? dcs[0].DataCollection.dataCollectionId : 0);
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
          {/* <SSXDataCollectionGroupParameters
            dcg={dcg}
            session={session}
            proposalName={proposalName}
            dcs={dcs}
            sample={sample}
            sequences={sequences}
          ></SSXDataCollectionGroupParameters> */}
        </Tab.Pane>
      </Tab.Content>
    </Row>
  );
}

function DataCollectionGroupSummary({ dcg }: { dcg: DataCollection; session: SessionResponse; proposalName: string }) {
  const [selected, setSelected] = useState(0);

  const { data: dcs, isError: dcsError } = useEventsDataCollectionGroup({ dataCollectionGroupId: dcg.DataCollectionGroup.dataCollectionGroupId });
  if (dcsError) throw Error(dcsError);

  if (!dcs?.results) return null;

  const selectedDc = dcs.results[selected];

  return (
    <Col>
      <Row>
        <h4 className="text-center" style={{ margin: 10 }}>
          Cumulative summary
        </h4>
      </Row>
      <Row>
        <Suspense fallback={DefaultLoadingPanel}>
          <Col md={'auto'}>
            <ZoomImage style={{ maxWidth: 400 }} src="/images/temp/max.png"></ZoomImage>
          </Col>
          <Col md={'auto'}>
            <Suspense fallback={<LoadingPanel></LoadingPanel>}>
              <HitsStatistics dc={dcg}></HitsStatistics>
            </Suspense>
          </Col>
          <Col>
            <Suspense fallback={<LoadingPanel></LoadingPanel>}>
              <UnitCellStatistics dc={dcg}></UnitCellStatistics>
            </Suspense>
          </Col>
          <Col md={'auto'}>
            <Suspense fallback={<LoadingPanel></LoadingPanel>}>
              <DataCollectionGroupHitGraph dcs={dcs.results}></DataCollectionGroupHitGraph>
            </Suspense>
          </Col>
        </Suspense>
      </Row>
      <Row style={{ margin: 20, padding: 0, backgroundColor: '#d3d3d36b', border: '1px solid lightgray', borderRadius: 10 }}>
        <Col md={'auto'} style={{ margin: 0, marginRight: 20, padding: 0, display: 'flex' }}>
          <div style={{ overflowY: 'scroll', borderRight: '1px solid lightgray', borderRadius: 10, margin: 0, backgroundColor: '#345a8c8a' }}>
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
            {dcs.results.map((dc, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setSelected(index)}
                  className="text-center"
                  style={{
                    cursor: 'pointer',
                    margin: 0,
                    marginBottom: -1,
                    padding: 0,
                    border: '1px solid lightgray',

                    backgroundColor: selected == index ? '#345a8c' : undefined,
                  }}
                >
                  <span style={{ margin: 5, color: selected == index ? 'white' : undefined }}>
                    <strong>#{index + 1}</strong>
                  </span>
                </div>
              );
            })}
          </div>
        </Col>
        <Col style={{ margin: 0, padding: 0 }}>
          <Row>
            <h4 className="text-center" style={{ margin: 10 }}>
              Run #{selected + 1} summary
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
    </Col>
  );
}

function DataCollectionGroupHitGraph({ dcs }: { dcs: Event[] }) {
  const dcIds = dcs.map((v) => v.id);
  const { data, isError } = useSSXDataCollectionProcessings({ datacollectionIds: dcIds });

  if (isError) throw Error(isError);

  if (data == undefined || !data.length) {
    return <></>;
  }

  const x = _.range(1, data.length + 1);
  const y = data.map((d) => d.nbHits);

  return (
    <PlotWidget
      data={[
        {
          type: 'bar',
          y: y,
          x: x,
          opacity: 0.75,
        },
      ]}
      layout={{ height: 300, width: 300, title: `hits` }}
      compact
    />
  );
}
