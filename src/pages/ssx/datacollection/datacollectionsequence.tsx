import { faInfoCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { dateToTimestamp, formatDateToDayAndPreciseTime } from 'helpers/dateparser';
import { useSSXDataCollectionSequences } from 'hooks/pyispyb';
import _ from 'lodash';
import { Alert, Badge, Col, Row, Toast } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { SSXDataCollectionResponse, SSXSequenceEventTypeResponse, SSXSequenceResponse } from '../model';

export default function SSXDataCollectionSequence({ dc }: { dc: SSXDataCollectionResponse }) {
  const { data: sequences, isError } = useSSXDataCollectionSequences(dc.DataCollection.dataCollectionId);
  if (isError) throw Error(isError);

  if (!sequences)
    return (
      <Alert variant="info">
        <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 10 }} />
        No sequence found.
      </Alert>
    );

  return (
    <Row>
      {sequences.map((sequence) => (
        <Col key={sequence.sequenceId}>
          <Sequence sequence={sequence}></Sequence>
        </Col>
      ))}
    </Row>
  );
}

export function Sequence({ sequence }: { sequence: SSXSequenceResponse }) {
  return (
    <Toast style={{ margin: 10, width: 'auto' }}>
      <Toast.Header closeButton={false}>
        <strong className="me-auto">{sequence.name || 'Unnamed sequence'}</strong>
        <small>{sequence.sequence_events.length} events</small>
      </Toast.Header>
      <Toast.Body>
        {sequence.sequence_events.length > 10 ? <SummarySequence sequence={sequence}></SummarySequence> : <DetailedSequence sequence={sequence}></DetailedSequence>}
      </Toast.Body>
    </Toast>
  );
}

function formatEventTypeObj(type: SSXSequenceEventTypeResponse | undefined) {
  if (type) return formatEventType(type.name);
  return undefined;
}

function formatEventType(type: string) {
  if (type == 'LaserExcitation') return 'Laser excitation';
  if (type == 'XrayDetection') return 'Xray detection';
  if (type == 'XrayExposure') return 'Xray exposure';
  if (type == 'ReactionTrigger') return 'Reaction trigger';
  return type;
}

export function SummarySequence({ sequence }: { sequence: SSXSequenceResponse }) {
  const groups = _(sequence.sequence_events).groupBy((s) => s.SequenceEventType.name);
  return (
    <>
      {groups
        .keys()
        .sort()
        .map((key) => {
          const events = groups.get(key);
          const times = _(events)
            .map((e) => e.time)
            .sort((a, b) => dateToTimestamp(a) - dateToTimestamp(b));
          const firstTime = times.first();
          const lastTime = times.last();
          return (
            <p key={key}>
              {formatEventType(key)} <Badge>{events.length}</Badge>
              {firstTime && lastTime ? (
                <>
                  <Badge bg={'secondary'}>first: {formatDateToDayAndPreciseTime(firstTime)}</Badge> <Badge bg={'secondary'}>last: {formatDateToDayAndPreciseTime(lastTime)}</Badge>
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

export function DetailedSequence({ sequence }: { sequence: SSXSequenceResponse }) {
  return (
    <BootstrapTable
      keyField="SessionTableToolkitProvider"
      data={sequence.sequence_events}
      bootstrap4
      striped
      condensed
      columns={[
        { text: 'id', dataField: 'sequenceEventId', hidden: true },
        { text: 'time', dataField: 'time', sort: true, formatter: formatDateToDayAndPreciseTime, sortValue: dateToTimestamp },
        { text: 'type', dataField: 'SequenceEventType', sort: true, formatter: formatEventTypeObj },
        { text: 'name', dataField: 'name', sort: true, hidden: !sequence.sequence_events.some((e) => e.name) },
        { text: 'duration', dataField: 'duration', sort: true, hidden: !sequence.sequence_events.some((e) => e.duration) },
        { text: 'period', dataField: 'period', sort: true, hidden: !sequence.sequence_events.some((e) => e.period) },
        { text: 'repetition', dataField: 'repetition', sort: true, hidden: !sequence.sequence_events.some((e) => e.repetition) },
      ]}
    ></BootstrapTable>
  );
}
