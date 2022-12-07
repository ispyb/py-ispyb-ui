import { EventChainResource } from 'api/resources/EventChains';
import _ from 'lodash';
import { Event } from 'models/Event';
import { EventChainResponse, EventType } from 'models/EventChainResponse.d';
import { Badge, Col, Container, Row, Toast } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { useSuspense } from 'rest-hooks';

export function EventChains({ dcg }: { dcg: Event }) {
  const eventChains = useSuspense(EventChainResource.list(), {
    dataCollectionId: dcg.id,
  });
  console.log(eventChains);

  return (
    <Container fluid>
      <Row>
        {eventChains.map((chain) => {
          return (
            <Col key={chain.eventChainId}>
              <EventChain eventChain={chain}></EventChain>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export function EventChain({ eventChain }: { eventChain: EventChainResponse }) {
  return (
    <Toast style={{ width: '100%', boxShadow: 'none' }}>
      <Toast.Header closeButton={false}>
        <strong className="me-auto">
          {eventChain.name || 'Unnamed events'}
        </strong>
        <small>{eventChain.events.length} events</small>
      </Toast.Header>
      <Toast.Body>
        {eventChain.events.length > 10 ? (
          <SummaryEventChain eventChain={eventChain}></SummaryEventChain>
        ) : (
          <DetailedEventChain eventChain={eventChain}></DetailedEventChain>
        )}
      </Toast.Body>
    </Toast>
  );
}

function formatEventTypeObj(type: EventType | undefined) {
  if (type) return formatEventType(type.name);
  return undefined;
}

function formatEventType(type: string) {
  if (type === 'LaserExcitation') return 'Laser excitation';
  if (type === 'XrayDetection') return 'Xray detection';
  if (type === 'XrayExposure') return 'Xray exposure';
  if (type === 'ReactionTrigger') return 'Reaction trigger';
  return type;
}

export function SummaryEventChain({
  eventChain,
}: {
  eventChain: EventChainResponse;
}) {
  const groups = _(eventChain.events).groupBy((c) => c.EventType.name);
  return (
    <>
      {groups
        .keys()
        .sort()
        .map((key) => {
          const events = groups.get(key);
          const times = _(events)
            .map((e) => e.offset)
            .sort((a, b) => a - b);
          const firstTime = times.first();
          const lastTime = times.last();
          return (
            <p key={key}>
              {formatEventType(key)} <Badge>{events.length}</Badge>
              {firstTime && lastTime ? (
                <>
                  <Badge bg={'secondary'}>first: {firstTime}</Badge>
                  <Badge bg={'secondary'}>last: {lastTime}</Badge>
                </>
              ) : (
                <></>
              )}
            </p>
          );
        })
        .value()}
    </>
  );
}

export function DetailedEventChain({
  eventChain,
}: {
  eventChain: EventChainResponse;
}) {
  return (
    <BootstrapTable
      keyField="SessionTableToolkitProvider"
      data={eventChain.events}
      bootstrap4
      striped
      condensed
      columns={[
        { text: 'id', dataField: 'eventChainId', hidden: true },
        { text: 'offset', dataField: 'offset', sort: true },
        {
          text: 'type',
          dataField: 'EventType',
          sort: true,
          formatter: formatEventTypeObj,
        },
        {
          text: 'name',
          dataField: 'name',
          sort: true,
          hidden: !eventChain.events.some((e) => e.name),
        },
        {
          text: 'duration',
          dataField: 'duration',
          sort: true,
          hidden: !eventChain.events.some((e) => e.duration),
        },
        {
          text: 'period',
          dataField: 'period',
          sort: true,
          hidden: !eventChain.events.some((e) => e.period),
        },
        {
          text: 'repetition',
          dataField: 'repetition',
          sort: true,
          hidden: !eventChain.events.some((e) => e.repetition),
        },
      ]}
    ></BootstrapTable>
  );
}
