import React from 'react';
import Menu from 'components/menu/menu';
import { DateRangePicker } from 'react-dates';
import { ButtonGroup, Form } from 'react-bootstrap';
import ActionToggleButton from 'components/buttons/actiontogglebutton';
import { ActionToggleButtonType } from 'components/buttons/actiontogglebutton';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
interface SessionTableMenuType {
  items: Array<ActionToggleButtonType>;
  SearchMenu?: React.ElementType;
}

export default function SessionTableMenu({ items, SearchMenu }: SessionTableMenuType) {
  return (
    <Menu>
      <ButtonGroup className="mb-2">
        {items.map((item: ActionToggleButtonType) => (
          <ActionToggleButton text={item.text} checked={item.checked} action={item.action} actionType={item.actionType} />
        ))}
      </ButtonGroup>

      <DateRangePicker
      //showClearDates
      //startDate={this.state.startDate}
      //startDateId="your_unique_start_date_id"
      //endDate={this.state.endDate}
      //endDateId="your_unique_end_date_id"
      // onDatesChange={this.handleDatesChange}
      // focusedInput={this.state.focusedInput}
      //onFocusChange={(focusedInput) => this.setState({ focusedInput })}
      //daySize={30}
      //displayFormat="DD/MM/YYYY"
      //small
      //isOutsideRange={() => false}
      //showDefaultInputIcon
      />
      <Form className="d-flex">{SearchMenu}</Form>
    </Menu>
  );
}
