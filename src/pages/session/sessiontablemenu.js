import ActionToggleButton from 'components/buttons/actiontogglebutton';
import { ButtonGroup } from 'react-bootstrap';
import Menu from 'components/menu/menu';

export default function SessionTableMenu() {
  return (
    <Menu>
      <ButtonGroup className="mb-2">
        <ActionToggleButton text="MX" />
        <ActionToggleButton text="SAXS" />
        <ActionToggleButton text="EM" />
      </ButtonGroup>
    </Menu>
  );
}
