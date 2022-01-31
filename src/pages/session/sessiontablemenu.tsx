import React, { useState } from 'react';
import Menu from 'components/menu/menu';
import moment, { Moment } from 'moment';
import { useSearchParams } from 'react-router-dom';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';
import { ButtonGroup, Form } from 'react-bootstrap';
import ActionToggleButton from 'components/buttons/actiontogglebutton';
import { ActionToggleButtonType } from 'components/buttons/actiontogglebutton';

interface SessionTableMenuType {
  checkList: Array<ActionToggleButtonType>;
  searchMenu: React.ElementType;
  showDatePicker: boolean;
}

export default function SessionTableMenu(props: SessionTableMenuType) {
  const { checkList, searchMenu, showDatePicker } = props;
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();

  const [startDate, setStartDate] = useState<Moment | null>(moment());
  const [focusedInput, setFocusedInput] = useState<boolean>(false);

  const onDateChange = (date: moment.Moment | null) => {
    setStartDate(date);
    setSearchParams({ startDate: moment(date).format('YYYYMMDD'), endDate: moment(date).add(1, 'day').format('YYYYMMDD') });
  };

  return (
    <Menu>
      <ButtonGroup className="mb-2">
        {checkList &&
          checkList.map((item: ActionToggleButtonType) => <ActionToggleButton text={item.text} checked={item.checked} action={item.action} actionType={item.actionType} />)}
      </ButtonGroup>
      {showDatePicker && (
        <SingleDatePicker
          id="session_date_picker"
          small
          showDefaultInputIcon
          isOutsideRange={() => false}
          displayFormat="DD/MM/YYYY"
          date={startDate}
          onDateChange={onDateChange}
          focused={focusedInput}
          onFocusChange={({ focused }) => setFocusedInput(focused)}
        ></SingleDatePicker>
      )}

      <Form className="d-flex">{searchMenu}</Form>
    </Menu>
  );
}
