import { useState } from 'react';
import Menu from 'legacy/components/menu/menu';
import moment, { Moment } from 'moment';
import { useSearchParams } from 'react-router-dom';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker, FocusedInputShape } from 'react-dates';
import { Col, Row } from 'react-bootstrap';

interface SessionTableMenuType {
  checkList: Array<{ text: string; selected: boolean; onClick: () => void }>;
  showDatePicker: boolean;
  startDate?: string;
  // eslint-disable-next-line no-unused-vars
  setStartDate?: (_: string) => void;
  endDate?: string;
  // eslint-disable-next-line no-unused-vars
  setEndDate?: (_: string) => void;
  showEmptySessions: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowEmptySessions: (_: boolean) => void;
}

export default function SessionTableMenu({
  checkList,
  showDatePicker,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  showEmptySessions,
  setShowEmptySessions,
}: SessionTableMenuType) {
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();

  const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(
    null
  );

  const [localStartDate, setLocalStartDate] = useState<Moment | null>(
    moment(startDate)
  );
  const [localEndDate, setLocalEndDate] = useState<Moment | null>(
    moment(endDate)
  );

  const onDateChange = ({
    startDate,
    endDate,
  }: {
    startDate: Moment | null;
    endDate: Moment | null;
  }) => {
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
    if (focusedInput === null || focusedInput === 'endDate') {
      if (startDate && setStartDate) {
        setStartDate(moment(startDate).format('YYYYMMDD'));
      }
      if (endDate && setEndDate) {
        setEndDate(moment(endDate).format('YYYYMMDD'));
      }
      setSearchParams({
        startDate: moment(startDate).format('YYYYMMDD'),
        endDate: moment(endDate).format('YYYYMMDD'),
      });
    }
  };

  const onFocusChange = (focusedInput: FocusedInputShape | null) => {
    setFocusedInput(focusedInput);
  };

  return (
    <Menu>
      <Col className="m-2" xs={'auto'}>
        <Row>
          <strong>Filter by technique</strong>
        </Row>
        <Row>
          {checkList &&
            checkList.map((i) => (
              <Col key={i.text} xs={'auto'} style={{ paddingRight: 0 }}>
                <div
                  style={{ fontSize: 18, margin: 0 }}
                  className="form-check form-switch"
                >
                  <input
                    checked={i.selected}
                    onChange={i.onClick}
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                  />
                  <label className="form-check-label">{i.text}</label>
                </div>
              </Col>
            ))}
        </Row>
        <Row>
          <Col>
            <div
              style={{ fontSize: 18, margin: 0 }}
              className="form-check form-switch"
            >
              <input
                checked={showEmptySessions}
                onChange={() => {
                  setShowEmptySessions(!showEmptySessions);
                }}
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
              />
              <label className="form-check-label">Show empty sessions</label>
            </div>
          </Col>
        </Row>
      </Col>
      {showDatePicker && (
        <Col className="m-2" style={{ paddingLeft: '1rem' }}>
          <Row>
            <strong>Select date</strong>
          </Row>
          <Row>
            <DateRangePicker
              startDate={localStartDate}
              startDateId="session_start_date_id"
              endDate={localEndDate}
              endDateId="session_end_date_id"
              onDatesChange={onDateChange}
              focusedInput={focusedInput}
              onFocusChange={onFocusChange}
              isOutsideRange={() => false}
              displayFormat="DD/MM/YYYY"
            />
          </Row>
        </Col>
      )}
    </Menu>
  );
}
