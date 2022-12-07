import { ReactElement } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Event } from 'models/Event.d';
import { usePath } from 'hooks/usePath';
import { formatDateToDayAndTime } from 'helpers/dateparser';

export interface IButtonProps {
  icon?: ReactElement;
  content?: ReactElement;
  hint: string;
  variant?: string;
  disabled?: boolean;
  hidden?: boolean;
  onClick?: () => void;
}

interface IButtonsProps {
  buttons: Array<IButtonProps>;
}

export function Buttons(props: IButtonsProps) {
  const btns = props.buttons.filter((b) => !b.hidden);
  return (
    <>
      {btns.map((button) => {
        return (
          <Button
            className="me-1"
            size="sm"
            key={button.hint}
            onClick={button.onClick}
            variant={button.variant}
            disabled={button.disabled}
          >
            {button.icon}
            {button.content !== undefined && (
              <span className="ms-1">{button.content}</span>
            )}
            <span className="visually-hidden">{button.hint}</span>
          </Button>
        );
      })}
      {btns.length ? (
        <span
          style={{
            borderLeft: '1px solid lightgrey',
            marginLeft: 10,
            marginRight: 10,
          }}
        ></span>
      ) : null}
    </>
  );
}

interface IEventHeader {
  event: Event;
  title: string;
  buttons?: Array<IButtonProps>;
}

export function EventHeader(props: IEventHeader) {
  const sessionId = usePath('sessionId');
  const { event, buttons, title } = props;

  return (
    <div className="event-header">
      <h3 className="text-white rounded p-3 mb-3">
        {buttons && <Buttons buttons={buttons} />}
        {!sessionId && (
          <>
            <Link
              className="btn btn-secondary btn-sm"
              to={`/proposals/${event.proposal}/sessions/${event.sessionId}`}
            >
              {event.session ? event.session : event.proposal}
            </Link>
            <span
              style={{
                borderLeft: '1px solid white',
                marginLeft: 10,
                marginRight: 10,
              }}
            ></span>
          </>
        )}
        {formatDateToDayAndTime(event.startTime)}
        {title.length ? <> - {title}</> : null}
      </h3>
    </div>
  );
}

export function EventBase({ children }: { children: JSX.Element }) {
  return <div className="event rounded p-2 mb-2">{children}</div>;
}
