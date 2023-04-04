import { HelpIcon } from 'components/Common/HelpIcon';
import { MetadataRow } from 'components/Events/Metadata';
import {
  addHours,
  formatDuration,
  intervalToDuration,
  roundToNearestMinutes,
  setMinutes,
} from 'date-fns';
import {
  formatDateToDay,
  formatDateToDayAndTime,
  formatDateToHour,
  parseDate,
} from 'helpers/dateparser';
import { isDataset } from 'legacy/helpers/mx/isDataset';
import {
  useMXDataCollectionsBy,
  useMXEnergyScans,
  useMXFluorescenceSpectras,
  useSession,
} from 'legacy/hooks/ispyb';
import { Session } from 'legacy/pages/model';
import _ from 'lodash';
import { useState } from 'react';
import {
  Alert,
  Col,
  Container,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';
import {
  DataCollectionGroup,
  EnergyScan,
  FluorescenceSpectra,
} from '../../model';

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

  const datasets = dataCollectionGroups?.filter(isDataset) || [];

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
          truncate={false}
          auto
          properties={[
            { title: 'Beamline operator', content: session?.beamLineOperator },
            {
              title: 'Samples analysed',
              content: (
                <>
                  {
                    _(dataCollectionGroups)
                      .map((dcg) => dcg.BLSample_name)
                      .uniq()
                      .value().length
                  }
                  <HelpIcon
                    style={{ marginLeft: 10 }}
                    message="This is the number of samples which have been analysed whether or not they gave a result."
                  />
                </>
              ),
            },
            {
              title: 'Datasets',
              content: (
                <>
                  {datasets.length +
                    ' (autoprocessed ' +
                    datasets?.filter((dc) => {
                      return dc.scalingStatisticsTypes !== undefined;
                    }).length +
                    ')'}
                  <HelpIcon
                    style={{ marginLeft: 10 }}
                    message="This is the number of samples for which a complete dataset (with oscillation) has been collected."
                  />
                </>
              ),
            },
            {
              title: 'Data collections',
              content: dataCollectionGroups?.filter(
                (dataCollectionGroup) =>
                  dataCollectionGroup.DataCollection_dataCollectionId !==
                  undefined
              ).length,
            },
            { title: 'Energy scans', content: energyScans?.length },
            { title: 'Fluorescence spectras', content: spectras?.length },
          ]}
        ></MetadataRow>

        {session && (
          <>
            <Row style={{ marginBottom: '1rem' }}>
              <SessionTimeLine
                dataCollectionGroups={dataCollectionGroups || []}
                energyScans={energyScans || []}
                fluorescenceSpectras={spectras || []}
                session={session}
              />
            </Row>
          </>
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
          info: [
            `Sample: ${dcg.BLSample_name}`,
            `Protein: ${dcg.Protein_acronym}`,
          ],
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

  const bookedTime = intervalToDuration({
    start: roundToNearestMinutes(parseDate(session?.BLSession_startDate)),
    end: roundToNearestMinutes(parseDate(session?.BLSession_endDate)),
  });

  const useTimeStart = dataCollectionGroups?.length
    ? _(dataCollectionGroups)
        .filter((dcg) => dcg.DataCollectionGroup_startTime !== null)
        .map((dcg) => parseDate(dcg.DataCollectionGroup_startTime).getTime())
        .min()
    : undefined;

  const useTimeEnd = dataCollectionGroups?.length
    ? _(dataCollectionGroups)
        .filter((dcg) => dcg.DataCollectionGroup_endTime !== null)
        .map((dcg) => parseDate(dcg.DataCollectionGroup_endTime).getTime())
        .max()
    : undefined;

  const usedTime =
    useTimeStart && useTimeEnd
      ? intervalToDuration({
          start: roundToNearestMinutes(useTimeStart),
          end: roundToNearestMinutes(useTimeEnd),
        })
      : undefined;

  const duration = _(dataCollectionGroups)
    .map((dcg) => {
      const start = parseDate(dcg.DataCollectionGroup_startTime);
      const end = parseDate(dcg.DataCollectionGroup_endTime);
      return end.getTime() - start.getTime();
    })
    .sum();

  const effectiveDuration = intervalToDuration({
    start: 0,
    end: duration || 0,
  });
  return (
    <Col>
      <strong>Session timeline</strong>
      <div
        style={{
          backgroundColor: 'rgb(238,238,238)',
          borderRadius: 5,
          border: '1px solid lightgrey',
          padding: 10,
        }}
      >
        <div
          style={{
            width: '100%',
            position: 'relative',
            paddingBottom: 30,
            paddingTop: 30,
          }}
        >
          <div
            style={{
              border: '1px solid gray',
              borderRadius: 5,
              width: '100%',
              height: 30,
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: 'white',
            }}
          >
            {buildEventsElements(
              [...collections, ...scans, ...spects],
              start,
              end
            )}
          </div>
          {buildTicksElements(
            [...collections, ...scans, ...spects],
            start,
            end
          )}
          {buildLabelElements(
            [...collections, ...scans, ...spects],
            start,
            end
          )}
        </div>
        <TimelineLegend />
        <div style={{ borderTop: '1px solid grey', margin: 10 }} />
        <Row>
          <Col>
            <strong>Booked time: </strong>
            <i>{formatDuration(bookedTime)}</i>
          </Col>
          <Col>
            <strong>Used time: </strong>
            <i>
              <>
                {usedTime ? formatDuration(usedTime) : 'none'}
                <HelpIcon
                  style={{ marginLeft: 10 }}
                  message="Time between first and last data collection"
                />
              </>
            </i>
          </Col>
          <Col>
            <strong>Effective beamtime used: </strong>
            <i>
              <>
                {formatDuration(effectiveDuration)}
                <HelpIcon
                  style={{ marginLeft: 10 }}
                  message="Cumulative data collection duration"
                />
              </>
            </i>
          </Col>
        </Row>
      </div>
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
    return (
      <EventElement
        key={i}
        e={e}
        earliest={earliest}
        duration={duration}
        index={i}
      />
    );
  });
}

function EventElement({
  e,
  earliest,
  duration,
  index,
}: {
  e: TimelineEvent;
  earliest: number;
  duration: number;
  index: number;
}) {
  const [active, setActive] = useState(false);
  const leftPercentage = ((e.start.getTime() - earliest) / duration) * 100;
  const rightPercentage = 100 - ((e.end.getTime() - earliest) / duration) * 100;
  return (
    <OverlayTrigger
      onEnter={() => setActive(true)}
      onExit={() => setActive(false)}
      placement="bottom"
      trigger={['hover', 'focus']}
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
            <br />
            {e.info?.map((i, j) => (
              <span key={j}>
                <i>{i}</i>
                <br />
              </span>
            ))}
          </Popover.Body>
        </Popover>
      }
    >
      <div
        style={{
          backgroundColor: active ? 'red' : timelineEventColors[e.type],
          position: 'absolute',
          top: 0,
          bottom: 0,
          minWidth: 5,
          left: leftPercentage + '%',
          right: rightPercentage + '%',
          zIndex: active ? Number.MAX_SAFE_INTEGER : index,
        }}
      ></div>
    </OverlayTrigger>
  );
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
          top: 20,
          bottom: 20,
          width: 2,
          left: leftStartPercentage + '%',
          zIndex: events.length + 1,
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
        zIndex: events.length + 1,
      }}
    >
      <i>
        <strong>Session start: </strong>
        {leftStartPercentage
          ? formatDateToDayAndTime(start.toISOString())
          : formatDateToDay(start.toISOString())}
      </i>
    </small>,
    rightEndPercentage ? (
      <div
        key="sessionEnd"
        style={{
          backgroundColor: 'red',
          position: 'absolute',
          top: 20,
          bottom: 20,
          width: 2,
          right: rightEndPercentage + '%',
          zIndex: events.length + 1,
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
        zIndex: events.length + 1,
      }}
    >
      <i>
        <strong>Session {rightEndPercentage ? 'programmed ' : ''} end: </strong>
        {rightEndPercentage
          ? formatDateToDayAndTime(end.toISOString())
          : formatDateToDay(end.toISOString())}
      </i>
    </small>,
  ];
}

function buildTicksElements(events: TimelineEvent[], start: Date, end: Date) {
  const earliest = events.reduce(
    (acc, e) => (e.start.getTime() < acc ? e.start.getTime() : acc),
    start.getTime()
  );
  const latest = events.reduce(
    (acc, e) => (e.end.getTime() > acc ? e.end.getTime() : acc),
    end.getTime()
  );
  const duration = latest - earliest;

  let ticks = [earliest, latest];

  let time = new Date(earliest);
  time = setMinutes(time, 0);
  time = addHours(time, 4);

  while (time.getTime() < latest) {
    ticks.push(time.getTime());
    time = addHours(time, 4);
  }

  ticks = ticks.sort();

  return ticks.map((t, i) => {
    const leftPercentage = ((t - earliest) / duration) * 100;
    let position = 'translate(-50%, 0)';
    if (i === 0) {
      position = 'translate(0, 0)';
    } else if (i === ticks.length - 1) {
      position = 'translate(-100%, 0)';
    }
    return (
      <>
        {i !== 0 && i !== ticks.length - 1 && (
          <div
            key={`${i}tick`}
            style={{
              position: 'absolute',
              top: 30,
              bottom: 22,
              width: 1,
              left: leftPercentage + '%',
              zIndex: 0,
              borderLeft: '1px dashed grey',
            }}
          />
        )}
        <small
          style={{
            position: 'absolute',
            bottom: 5,
            left: leftPercentage + '%',
            zIndex: events.length,
            transform: position,
          }}
        >
          <i key={`${i}label`}>{formatDateToHour(new Date(t).toISOString())}</i>
        </small>
      </>
    );
  });
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
  info?: string[];
};

const timelineEventColors: Record<TimelineElementType, string> = {
  'Data collection': 'blue',
  'Fluorescence spectra': 'green',
  'Energy scan': 'orange',
};
