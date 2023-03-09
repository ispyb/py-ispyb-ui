import { MetadataRow } from 'components/Events/Metadata';
import { formatDateToDayAndTime, parseDate } from 'helpers/dateparser';
import {
  useMXDataCollectionsBy,
  useMXEnergyScans,
  useMXFluorescenceSpectras,
  useSession,
} from 'legacy/hooks/ispyb';
import { Session } from 'legacy/pages/model';
import _ from 'lodash';
import {
  Alert,
  Col,
  Container,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';
import { DataCollectionGroup, EnergyScan, FluorescenceSpectra } from '../model';

export function SessionInfo({
  sessionId,
  proposalName,
}: {
  sessionId: string;
  proposalName: string;
}) {
  const { data: sessionL } = useSession({ proposalName, sessionId });
  const session = sessionL ? sessionL[0] : undefined;
  const { data: dataCollectionGroups } = useMXDataCollectionsBy({
    proposalName,
    sessionId,
  });
  const { data: spectras } = useMXFluorescenceSpectras({
    proposalName,
    sessionId,
  });
  const { data: energyScans } = useMXEnergyScans({
    proposalName,
    sessionId,
  });
  return (
    <Container fluid>
      <Col style={{ margin: 10 }}>
        <Row>
          <Col>
            <Alert variant="info">
              <strong>
                Session on beamline {session?.beamLineName || 'unknown'} from{' '}
                {formatDateToDayAndTime(session?.BLSession_startDate)} to{' '}
                {formatDateToDayAndTime(session?.BLSession_endDate)}
              </strong>
            </Alert>
          </Col>
        </Row>
        <MetadataRow
          properties={[
            { title: 'Beamline operator', content: session?.beamLineOperator },
            { title: 'Images', content: session?.imagesCount },
            {
              title: 'Data collections',
              content: dataCollectionGroups?.length,
            },
            { title: 'Energy scans', content: energyScans?.length },
            { title: 'Fluorescence spectras', content: spectras?.length },
          ]}
        />
        {session && (
          <Row>
            <SessionTimeLine
              dataCollectionGroups={dataCollectionGroups || []}
              energyScans={energyScans || []}
              fluorescenceSpectras={spectras || []}
              session={session}
            />
          </Row>
        )}
      </Col>
    </Container>
  );
}

export function SessionTimeLine({
  dataCollectionGroups,
  session,
  energyScans,
  fluorescenceSpectras,
}: {
  dataCollectionGroups: DataCollectionGroup[];
  energyScans: EnergyScan[];
  fluorescenceSpectras: FluorescenceSpectra[];
  session: Session;
}) {
  const start = parseDate(session.BLSession_startDate);
  const end = parseDate(session.BLSession_endDate);
  const collections: TimelineEvent[] = _(dataCollectionGroups)
    .sortBy((dcg) => parseDate(dcg.DataCollectionGroup_startTime).getTime())
    .map(
      (dcg) =>
        ({
          start: parseDate(dcg.DataCollectionGroup_startTime),
          end: parseDate(dcg.DataCollectionGroup_endTime),
          type: 'Data collection',
        } as TimelineEvent)
    )
    .value();
  const scans: TimelineEvent[] = _(energyScans)
    .sortBy((scan) => parseDate(scan.startTime).getTime())
    .map(
      (scan) =>
        ({
          start: parseDate(scan.startTime),
          end: parseDate(scan.endTime),
          type: 'Energy scan',
        } as TimelineEvent)
    )
    .value();
  const spects: TimelineEvent[] = _(fluorescenceSpectras)
    .sortBy((spect) => parseDate(spect.startTime).getTime())
    .map(
      (spect) =>
        ({
          start: parseDate(spect.startTime),
          end: parseDate(spect.endTime),
          type: 'Fluorescence spectra',
        } as TimelineEvent)
    )
    .value();
  return (
    <Col>
      <strong>Session timeline</strong>
      <div
        style={{
          border: '1px solid gray',
          borderRadius: 5,
          width: '100%',
          height: 20,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {buildEventsElements([...collections, ...scans, ...spects], start, end)}
      </div>
      <div
        style={{
          width: '100%',
          height: 20,
          position: 'relative',
        }}
      >
        {buildLabelElements([...collections, ...scans, ...spects], start, end)}
      </div>
      <TimelineLegend />
    </Col>
  );
}

function TimelineLegend() {
  return (
    <Row>
      {timelineElementTypes.map((e, i) => {
        const color = timelineEventColors[e];
        return (
          <Col key={e} xs={'auto'}>
            <span key={e} style={{ marginRight: 10 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  backgroundColor: color,
                  marginRight: 5,
                }}
              />
              {e}
            </span>
          </Col>
        );
      })}
    </Row>
  );
}

function buildEventsElements(events: TimelineEvent[], start: Date, end: Date) {
  const earliest = events.reduce(
    (acc, e) => (e.start.getTime() < acc ? e.start.getTime() : acc),
    start.getTime()
  );
  const latest = events.reduce(
    (acc, e) => (e.end.getTime() > acc ? e.end.getTime() : acc),
    end.getTime()
  );
  const duration = latest - earliest;
  return events.map((e, i) => {
    const leftPercentage = ((e.start.getTime() - earliest) / duration) * 100;
    const rightPercentage =
      100 - ((e.end.getTime() - earliest) / duration) * 100;
    return (
      <OverlayTrigger
        key={i}
        placement="bottom"
        overlay={
          <Popover id="popover-basic">
            <Popover.Body>
              <strong>{e.type}</strong>
              <br />
              <strong>Start: </strong>
              <i>{formatDateToDayAndTime(e.start.toISOString())}</i>
              <br />
              <strong>End: </strong>
              <i>{formatDateToDayAndTime(e.end.toISOString())}</i>
            </Popover.Body>
          </Popover>
        }
      >
        <div
          style={{
            backgroundColor: timelineEventColors[e.type],
            position: 'absolute',
            top: 0,
            bottom: 0,
            minWidth: 5,
            left: leftPercentage + '%',
            right: rightPercentage + '%',
            zIndex: i,
          }}
        ></div>
      </OverlayTrigger>
    );
  });
}

function buildLabelElements(events: TimelineEvent[], start: Date, end: Date) {
  const earliest = events.reduce(
    (acc, e) => (e.start.getTime() < acc ? e.start.getTime() : acc),
    start.getTime()
  );
  const latest = events.reduce(
    (acc, e) => (e.end.getTime() > acc ? e.end.getTime() : acc),
    end.getTime()
  );
  const duration = latest - earliest;
  const sessionStart = start.getTime();
  const sessionEnd = end.getTime();

  const leftStartPercentage = ((sessionStart - earliest) / duration) * 100;
  const rightEndPercentage = 100 - ((sessionEnd - earliest) / duration) * 100;

  return [
    leftStartPercentage ? (
      <div
        key="sessionStart"
        style={{
          backgroundColor: 'red',
          position: 'absolute',
          top: -20,
          bottom: 0,
          left: leftStartPercentage + '%',
          zIndex: events.length,
        }}
      ></div>
    ) : (
      <></>
    ),
    <small
      key="sessionStartLabel"
      style={{
        position: 'absolute',
        top: 0,
        left: leftStartPercentage + '%',
        zIndex: events.length,
      }}
    >
      <i>
        <strong>Session start: </strong>
        {formatDateToDayAndTime(start.toISOString())}
      </i>
    </small>,
    rightEndPercentage ? (
      <div
        key="sessionEnd"
        style={{
          backgroundColor: 'red',
          position: 'absolute',
          top: -20,
          bottom: 0,
          width: 2,
          right: rightEndPercentage + '%',
          zIndex: events.length,
        }}
      ></div>
    ) : (
      <></>
    ),
    <small
      key="sessionEndLabel"
      style={{
        position: 'absolute',
        top: 0,
        right: rightEndPercentage + '%',
        zIndex: events.length,
      }}
    >
      <i>
        <strong>Session {rightEndPercentage ? 'programmed ' : ''} end: </strong>
        {formatDateToDayAndTime(end.toISOString())}
      </i>
    </small>,
  ];
}

const timelineElementTypes = [
  'Data collection',
  'Fluorescence spectra',
  'Energy scan',
] as const;

type TimelineElementType = typeof timelineElementTypes[number];

type TimelineEvent = {
  start: Date;
  end: Date;
  type: TimelineElementType;
};

const timelineEventColors: Record<TimelineElementType, string> = {
  'Data collection': 'blue',
  'Fluorescence spectra': 'green',
  'Energy scan': 'orange',
};
