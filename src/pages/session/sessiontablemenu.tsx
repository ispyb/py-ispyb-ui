import ActionToggleButton from 'components/buttons/actiontogglebutton';
import { ButtonGroup, Form, FormControl, Button } from 'react-bootstrap';
import Menu from 'components/menu/menu';
import { ActionToggleButtonType } from 'components/buttons/actiontogglebutton';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import React from 'react';

interface SessionTableMenuType {
  items: Array<ActionToggleButtonType>;
  SearchMenu: React.ElementType;
}

export default function SessionTableMenu({ items, SearchMenu }: SessionTableMenuType) {
  return (
    <Menu>
      <ButtonGroup className="mb-2">
        {items.map((item: ActionToggleButtonType) => (
          <ActionToggleButton text={item.text} checked={item.checked} action={item.action} actionType={item.actionType} />
        ))}
      </ButtonGroup>

      <Form className="d-flex">
        <SearchMenu />
      </Form>
    </Menu>
  );
}
