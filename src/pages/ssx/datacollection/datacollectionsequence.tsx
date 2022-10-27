import { dateToTimestamp, formatDateToDayAndPreciseTime } from 'helpers/dateparser';
import _ from 'lodash';
import { Badge, Toast } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { SSXSequenceEventTypeResponse, SSXSequenceResponse } from '../model';

export function Sequence({ sequence }: { sequence: SSXSequenceResponse }) {
  return (
    <Toast style={{ margin: 10, width: 'auto', boxShadow: 'none' }}>
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
