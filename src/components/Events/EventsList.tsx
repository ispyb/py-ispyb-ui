import { JSXElementConstructor, Suspense } from 'react';
import { useSuspense, useSubscription } from 'rest-hooks';
import { useSearchParams, Link } from 'react-router-dom';
import { Alert, Col } from 'react-bootstrap';
import { Gear, PieChartFill } from 'react-bootstrap-icons';

import { EventResource } from 'api/resources/Event';
import { EventTypeResource } from 'api/resources/EventType';
import { ProcessingStatus } from 'api/resources/Processing/ProcessingStatus';
import { ProcessingMessageStatus } from 'api/resources/Processing/ProcessingMessageStatus';
import { usePath } from 'hooks/usePath';
import { usePaging } from 'hooks/usePaging';
import NetworkErrorPage from 'components/NetworkErrorPage';
import Paginator from 'components/Layout/Paginator';
import Filter from 'components/Filter';
import TimesBar from 'components/Stats/TimesBar';
import { Event } from 'models/Event.d';
import { Statuses as ProcessingStatusesType } from 'models/ProcessingStatusesList.d';
import { Statuses as ProcessingMessageStatusesType } from 'models/AutoProcProgramMessageStatuses.d';
import { EventBase } from './Events';
import Default from './Default';
import RobotAction from './RobotAction';
import DataCollection from './DataCollection';
import { useSessionInfo } from 'hooks/useSessionInfo';
import SessionOverview from 'components/Stats/SessionOverview';

function EventTypeFilter({
  urlKey,
  sessionId,
  blSampleId,
  proteinId,
}: {
  urlKey: string;
  sessionId?: string;
  blSampleId?: string;
  proteinId?: string;
}) {
  const eventTypes = useSuspense(EventTypeResource.list(), {
    ...(sessionId ? { sessionId } : null),
    ...(blSampleId ? { blSampleId } : null),
    ...(proteinId ? { proteinId } : null),
  });

  const filterTypes = eventTypes.results.map((eventType) => ({
    filterKey: eventType.eventTypeName,
    filterValue: eventType.eventType,
  }));

  return (
    <Suspense>
      <Filter urlKey={urlKey} filters={filterTypes} />
    </Suspense>
  );
}

function EventStatusFilter({ urlKey }: { urlKey: string }) {
  const filterTypes = [
    {
      filterKey: 'Success',
      filterValue: 'success',
    },
    {
      filterKey: 'Failed',
      filterValue: 'failed',
    },
    {
      filterKey: 'Processed',
      filterValue: 'processed',
    },
    {
      filterKey: 'Processing Error',
      filterValue: 'processerror',
    },
  ];

  return <Filter urlKey={urlKey} filters={filterTypes} />;
}

function EventListButtons() {
  const proposal = usePath('proposal');
  const sessionId = usePath('sessionId');
  const sessionInfo = useSessionInfo(sessionId);
  return (
    <>
      {/* <Link
        className="btn btn-primary btn-sm me-1"
        to={`/proposals/${proposal}`}
      >
        <PeopleFill className="me-1" />
        Users
      </Link> */}
      <Link
        className="btn btn-primary btn-sm me-1"
        to={`/proposals/${proposal}/stats/${sessionId}`}
      >
        <PieChartFill className="me-1" />
        Stats
      </Link>
      {/* <Link
        className="btn btn-primary btn-sm me-1"
        to={`/proposals/${proposal}`}
      >
        <Wrench className="me-1" />
        Beamline Status
      </Link> */}
      {sessionInfo && sessionInfo._metadata.uiGroups?.includes('mx') && (
        <Link
          className="btn btn-primary btn-sm me-1"
          to={`/proposals/${proposal}/sessions/${sessionId}/samples`}
        >
          <Gear className="me-1" />
          Sample Changer
        </Link>
      )}
    </>
  );
}

function renderTemplate(
  event: Event,
  processingStatuses: ProcessingStatusesType,
  processngMessageStatuses: ProcessingMessageStatusesType
) {
  const templates: Record<string, JSXElementConstructor<any>> = {
    dc: DataCollection,
    robot: RobotAction,
  };

  if (event.type in templates) {
    const Template = templates[event.type];
    const extraProps: Record<string, any> = {};
    if (event.type === 'dc') {
      extraProps.processingStatuses = processingStatuses[event.id];
      extraProps.messageStatuses = processngMessageStatuses[event.id];
    }
    return <Template item={event.Item} parent={event} {...extraProps} />;
  }

  return <Default {...event} />;
}

interface IEventsList {
  blSampleId?: string;
  proteinId?: string;
  beamLineName?: string;
  refresh?: boolean;
  limit?: number;
}

function EventListMain({
  blSampleId,
  proteinId,
  beamLineName,
  refresh,
  limit: initialLimit,
}: IEventsList) {
  const [searchParams] = useSearchParams();
  const sessionId = usePath('sessionId');
  const { skip, limit } = usePaging(initialLimit);
  const dataCollectionId = searchParams.get('dataCollectionId');
  const dataCollectionGroupId = searchParams.get('dataCollectionGroupId');
  const eventType = searchParams.get('eventType');
  const status = searchParams.get('status');

  const opts = {
    skip,
    limit,
    ...(dataCollectionId ? { dataCollectionId } : {}),
    ...(dataCollectionGroupId ? { dataCollectionGroupId } : {}),
    ...(blSampleId ? { blSampleId } : {}),
    ...(proteinId ? { proteinId } : {}),
    ...(sessionId ? { sessionId } : {}),
    ...(beamLineName ? { beamLineName } : {}),
    ...(eventType ? { eventType } : {}),
    ...(status ? { status } : {}),
  };

  const events = useSuspense(EventResource.list(), opts);
  useSubscription(EventResource.list(), refresh ? opts : null);

  const dataCollectionIds = events.results
    .filter((event) => event.type === 'dc')
    .map((event) => event.id);

  const processingStatuses = useSuspense(
    ProcessingStatus.list(),
    dataCollectionIds.length > 0
      ? { dataCollectionIds: JSON.stringify(dataCollectionIds) }
      : null
  );
  useSubscription(
    ProcessingStatus.list(),
    refresh && dataCollectionIds.length > 0 && refresh
      ? { dataCollectionIds: JSON.stringify(dataCollectionIds) }
      : null
  );

  const messageStatuses = useSuspense(
    ProcessingMessageStatus.list(),
    dataCollectionIds.length > 0
      ? { dataCollectionIds: JSON.stringify(dataCollectionIds) }
      : null
  );

  useSubscription(
    ProcessingMessageStatus.list(),
    dataCollectionIds.length > 0 && refresh
      ? { dataCollectionIds: JSON.stringify(dataCollectionIds) }
      : null
  );

  const title = dataCollectionGroupId
    ? `Data Collections for group ${dataCollectionGroupId}`
    : '';

  return (
    <section>
      <h1 className="d-flex justify-content-between">
        <Col>
          <span>{title ? `: ${title}` : 'Session'}</span>
          {sessionId && <SessionOverview />}
        </Col>
        {sessionId && <TimesBar />}
      </h1>

      {sessionId && <EventListButtons />}
      <div className="d-flex">
        <EventStatusFilter urlKey="status" />
        <EventTypeFilter
          urlKey="eventType"
          sessionId={sessionId}
          blSampleId={blSampleId}
          proteinId={proteinId}
        />
      </div>
      <Paginator total={events.total} skip={events.skip} limit={events.limit} />
      {events.results.map((event) => (
        <EventBase key={event.pk()}>
          {renderTemplate(
            event,
            processingStatuses ? processingStatuses.statuses : {},
            messageStatuses ? messageStatuses.statuses : {}
          )}
        </EventBase>
      ))}
      {!events.results.length && <Alert>No events yet</Alert>}
      <Paginator total={events.total} skip={events.skip} limit={events.limit} />
    </section>
  );
}

export default function EventList(props: IEventsList) {
  return (
    <NetworkErrorPage>
      <EventListMain {...props} />
    </NetworkErrorPage>
  );
}
