import { MetadataRow } from 'components/Events/Metadata';
import { addMinutes } from 'date-fns';
import { formatDateToDayAndTime, parseDate } from 'helpers/dateparser';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
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
  ProgressBar,
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
    <Container>
      <Col style={{ margin: 10 }}>
        <Row>
          <Alert variant="info">
            <strong>
              Session on beamline {session?.beamLineName || 'unknown'} from{' '}
              {formatDateToDayAndTime(session?.BLSession_startDate)} to{' '}
              {formatDateToDayAndTime(session?.BLSession_endDate)}
            </strong>
          </Alert>
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
          start: dcg.DataCollectionGroup_startTime || 'undefined',
          end: dcg.DataCollectionGroup_endTime || 'undefined',
          type: 'Data collection',
        } as TimelineEvent)
    )
    .value();
  const scans: TimelineEvent[] = _(energyScans)
    .sortBy((scan) => parseDate(scan.startTime).getTime())
    .map(
      (scan) =>
        ({
          start: scan.startTime || 'undefined',
          end: scan.endTime || 'undefined',
          type: 'Energy scan',
        } as TimelineEvent)
    )
    .value();
  const spects: TimelineEvent[] = _(fluorescenceSpectras)
    .sortBy((spect) => parseDate(spect.startTime).getTime())
    .map(
      (spect) =>
        ({
          start: spect.startTime || 'undefined',
          end: spect.endTime || 'undefined',
          type: 'Fluorescence spectra',
        } as TimelineEvent)
    )
    .value();
  console.log(spects);
  return (
    <Col>
      <strong>Session timeline</strong>
      <ProgressBar>
        {buildElements(
          getFullEvents(
            [...collections, ...scans, ...spects],
            session.BLSession_startDate,
            session.BLSession_endDate
          ),
          start,
          end
        )}
      </ProgressBar>
      <Row>
        <Col xs={'auto'}>
          <small>
            <i>{formatDateToDayAndTime(session.BLSession_startDate)}</i>
          </small>
        </Col>
        <Col></Col>
        <Col xs={'auto'}>
          <small>
            <i>{formatDateToDayAndTime(session.BLSession_endDate)}</i>
          </small>
        </Col>
      </Row>
    </Col>
  );
}

type TimelineElementType =
  | 'idle'
  | 'Data collection'
  | 'Fluorescence spectra'
  | 'Energy scan';

type TimelineEvent = {
  start: string;
  end: string;
  type: TimelineElementType;
};

const timelineEventColors: Record<TimelineElementType, string> = {
  idle: 'lightgray',
  'Data collection': 'blue',
  'Fluorescence spectra': 'green',
  'Energy scan': 'orange',
};

function getFullEvents(
  unsortedEvents: TimelineEvent[],
  start: string,
  end: string
): TimelineEvent[] {
  const fullEvents: TimelineEvent[] = [];

  const events = _(unsortedEvents)
    .sortBy((e) => parseDate(e.start).getTime())
    .value();

  //Create first idle event
  if (
    events.length > 0 &&
    parseDate(events[0].start).getTime() > parseDate(start).getTime()
  ) {
    const firstEvent: TimelineEvent = {
      start,
      end: events[0].start,
      type: 'idle',
    };
    fullEvents.push(firstEvent);
  }
  events.forEach((event) => {
    if (event.type === 'Fluorescence spectra') {
      console.log(event);
    }
    if (event.start === 'undefined' || event.end === 'undefined') return;
    let lastEvent =
      fullEvents.length > 0 ? fullEvents[fullEvents.length - 1] : undefined;
    //Skip event if it overlaps with previous
    if (
      lastEvent &&
      parseDate(lastEvent.end).getTime() > parseDate(event.start).getTime()
    ) {
      return;
    }
    //Build idle event between previous and current event
    if (
      lastEvent &&
      parseDate(lastEvent.end).getTime() < parseDate(event.start).getTime()
    ) {
      const idleEvent: TimelineEvent = {
        start: lastEvent.end,
        end: event.start,
        type: 'idle',
      };
      fullEvents.push(idleEvent);
      lastEvent = idleEvent;
    }

    let currentEnd = event.end;
    const minimalEnd = addMinutes(parseDate(currentEnd), 1);
    if (parseDate(event.end).getTime() < minimalEnd.getTime()) {
      currentEnd = minimalEnd.toISOString();
    }
    const currentEvent: TimelineEvent = {
      start: lastEvent?.end || event.start,
      end: currentEnd,
      type: event.type,
    };
    fullEvents.push(currentEvent);
  });
  //Build last idle event until end
  fullEvents.push({
    start: fullEvents[fullEvents.length - 1].end,
    end,
    type: 'idle',
  });

  return fullEvents;
}

function buildElements(
  events: TimelineEvent[],
  start: Date,
  end: Date
): JSX.Element[] {
  console.log(events);
  const duration = end.getTime() - start.getTime();
  return events.map((event, index) => {
    const eventStart = parseDate(event.start);
    const eventEnd = parseDate(event.end);
    const eventDuration = eventEnd.getTime() - eventStart.getTime();
    const eventPercentage = (eventDuration / duration) * 100;

    const popover = (
      <Popover id="popover-basic">
        <Popover.Header as="h3">{event.type}</Popover.Header>
        <Popover.Body>
          <Col>
            <Row> {formatDateToDayAndTime(event.start)}</Row>
            <Row> {formatDateToDayAndTime(event.end)}</Row>
          </Col>
        </Popover.Body>
      </Popover>
    );

    return (
      <OverlayTrigger
        key={index}
        trigger={['hover', 'focus']}
        placement="bottom"
        overlay={popover}
      >
        <ProgressBar
          now={eventPercentage}
          key={index}
          isChild={true}
          label={event.type}
          visuallyHidden={eventPercentage < 5}
          style={{
            backgroundColor: timelineEventColors[event.type],
            color: 'black',
          }}
        />
      </OverlayTrigger>
    );
  });
}
