import React, { useState } from 'react';
import Menu from 'components/menu/menu';
import moment, { Moment } from 'moment';
import { useSearchParams } from 'react-router-dom';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker, FocusedInputShape } from 'react-dates';
import { ButtonGroup } from 'react-bootstrap';
import ActionToggleButton from 'components/buttons/actiontogglebutton';
import { ActionToggleButtonType } from 'components/buttons/actiontogglebutton';

interface SessionTableMenuType {
  checkList?: Array<ActionToggleButtonType>;
  showDatePicker: boolean;
  startDate?: string;
  // eslint-disable-next-line no-unused-vars
  setStartDate?: (_: string) => void;
  endDate?: string;
  // eslint-disable-next-line no-unused-vars
  setEndDate?: (_: string) => void;
}

export default function SessionTableMenu({ checkList, showDatePicker, startDate, setStartDate, endDate, setEndDate }: SessionTableMenuType) {
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();

  const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(null);

  const [localStartDate, setLocalStartDate] = useState<Moment | null>(moment(startDate));
  const [localEndDate, setLocalEndDate] = useState<Moment | null>(moment(endDate));

  const onDateChange = ({ startDate, endDate }: { startDate: Moment | null; endDate: Moment | null }) => {
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
    if (focusedInput == null || focusedInput == 'endDate') {
      if (startDate && setStartDate) {
        setStartDate(moment(startDate).format('YYYYMMDD'));
      }
      if (endDate && setEndDate) {
        setEndDate(moment(endDate).format('YYYYMMDD'));
      }
      setSearchParams({ startDate: moment(startDate).format('YYYYMMDD'), endDate: moment(endDate).format('YYYYMMDD') });
    }
  };

  const onFocusChange = (focusedInput: FocusedInputShape | null) => {
    setFocusedInput(focusedInput);
  };

  return (
    <Menu>
      <ButtonGroup className="mb-2">
        {checkList &&
          checkList.map((item: ActionToggleButtonType) => <ActionToggleButton text={item.text} checked={item.checked} action={item.action} actionType={item.actionType} />)}
      </ButtonGroup>
      {showDatePicker && (
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
      )}
      <div></div>
    </Menu>
  );
}
