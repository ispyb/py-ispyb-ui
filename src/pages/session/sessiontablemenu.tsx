import ActionToggleButton from 'components/buttons/actiontogglebutton';
import { ButtonGroup, Form, FormControl, Button } from 'react-bootstrap';
import Menu from 'components/menu/menu';
import { ActionToggleButtonType } from 'components/buttons/actiontogglebutton';

interface SessionTableMenuType {
  items: Array<ActionToggleButtonType>;
}

export default function SessionTableMenu(props: SessionTableMenuType) {
  const items: Array<ActionToggleButtonType> = props.items;
  return (
    <Menu>
      <ButtonGroup className="mb-2">
        {items.map((item: ActionToggleButtonType) => (
          <ActionToggleButton text={item.text} checked={item.checked} action={item.action} actionType={item.actionType} />
        ))}
      </ButtonGroup>

      <Form className="d-flex">
        <FormControl type="search" placeholder="Search" className="me-2" aria-label="Search" />
        <Button variant="outline-success">Search</Button>
      </Form>
    </Menu>
  );
}
