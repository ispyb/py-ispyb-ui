import {
  createSearchParams,
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { DateTime, Info } from 'luxon';
import classNames from 'classnames';

import { useSuspense } from 'rest-hooks';
import { SessionResource } from 'api/resources/Session';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { Session } from 'models/Session.d';
import { usePath } from 'hooks/usePath';
import { range } from 'lodash';

function CalendarNav({ year, month }: { year: number; month: number }) {
  const navigate = useNavigate();
  const today = DateTime.now();
  const currentMonth = DateTime.fromObject({ year, month });

  const prevYear = currentMonth.minus({ year: 1 });
  const nextYear = currentMonth.plus({ year: 1 });

  const prevMonth = currentMonth.minus({ month: 1 });
  const nextMonth = currentMonth.plus({ month: 1 });

  function goto(date: DateTime) {
    navigate({
      search: createSearchParams({
        year: date.year.toString(),
        month: date.month.toString(),
      }).toString(),
    });
  }

  return (
    <Row>
      <Col md={4}>
        <ButtonGroup className="calendar-nav mb-1">
          <Button variant="secondary" onClick={() => goto(today)}>
            Go to today
          </Button>
        </ButtonGroup>
      </Col>
      <Col>
        <ButtonGroup className="calendar-nav mb-1">
          <Button variant="outline-primary" onClick={() => goto(prevYear)}>
            {'<<'} {prevYear.year}
          </Button>
          <Button variant="outline-primary" onClick={() => goto(prevMonth)}>
            {'<'} {prevMonth.monthLong}
          </Button>
          <Button disabled variant="dark">
            {currentMonth.monthLong} {currentMonth.year}
          </Button>
          <Button variant="outline-primary" onClick={() => goto(nextMonth)}>
            {nextMonth.monthLong} {'>'}
          </Button>
          <Button variant="outline-primary" onClick={() => goto(nextYear)}>
            {nextYear.year} {'>>'}
          </Button>
        </ButtonGroup>
      </Col>
    </Row>
  );
}

function CalendarHeader() {
  const days = Array(7).fill(0);
  return (
    <div className="calendar-header">
      {days.map((_, day) => (
        <div key={`head-${day}`} className="calendar-header-day">
          {Info.weekdays()[day]}
        </div>
      ))}
    </div>
  );
}

function SessionList({
  sessions,
  day,
}: {
  sessions: Session[];
  day: DateTime;
}) {
  const relevantSessions = sessions.filter((session) => {
    const dayEnd = day.endOf('day');
    const startTime = DateTime.fromISO(session.startDate);
    return startTime >= day && startTime <= dayEnd;
  });
  return (
    <ul>
      {relevantSessions.map((session) => {
        const sessionStartDate = DateTime.fromISO(session.startDate);
        const sessionEndDate = DateTime.fromISO(session.endDate);
        const duration = sessionEndDate.diff(sessionStartDate, 'hours');

        return (
          <li key={session.sessionId}>
            {sessionStartDate.toFormat('HH:mm')}
            <br />
            {session.beamLineName}:
            <Link
              to={`/proposals/${session.proposal}/sessions/${session.sessionId}`}
            >
              {session.session}
            </Link>{' '}
            ({Math.round(duration.hours)}h)
            <br />
            {session.beamLineOperator}
          </li>
        );
      })}
    </ul>
  );
}

function CalendarDays({ year, month }: { year: number; month: number }) {
  const proposal = usePath('proposal');
  const sessions = useSuspense(SessionResource.list(), {
    year,
    month,
    limit: 9999,
    ...(proposal ? { proposal } : {}),
  });

  const now = DateTime.now();
  const monthObj = DateTime.fromObject({ year: year, month: month });
  const startDay = monthObj.startOf('month');

  const days = range(1, monthObj.daysInMonth + 1);
  const preDays = startDay.weekday > 0 ? range(1, startDay.weekday) : [];

  return (
    <div className="calendar-days">
      {preDays.map((day) => (
        <div className="calendar-pre-day" key={`pre-${day}`}></div>
      ))}
      {days.map((day) => (
        <div
          key={`day-${day}`}
          className={classNames('calendar-day', {
            'calendar-day-today':
              day === now.day && month === now.month && year === now.year,
          })}
        >
          <h2>{day}</h2>
          <SessionList
            sessions={sessions.results}
            day={DateTime.fromObject({ year, month, day: day })}
          />
        </div>
      ))}
    </div>
  );
}

export default function Calendar() {
  const now = DateTime.now();
  const [searchParams] = useSearchParams();
  const yearParam = searchParams.get('year');
  const year = yearParam !== null ? parseInt(yearParam) : now.year;
  const monthParam = searchParams.get('month');
  const month = monthParam !== null ? parseInt(monthParam) : now.month;

  return (
    <section>
      <h1>
        {Info.months()[month - 1]} {year}
      </h1>
      <div className="calendar">
        <CalendarNav month={month} year={year} />
        <CalendarHeader />
        <CalendarDays month={month} year={year} />
      </div>
    </section>
  );
}
