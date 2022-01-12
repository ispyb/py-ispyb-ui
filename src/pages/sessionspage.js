import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { getSessions } from 'api/ispyb';
import { SessionTable } from 'pages/session/SessionTable';
import format from 'date-fns/format';
import PageLoading from 'components/pageloading';
import useQueryParams from 'hooks/usequeyparams';

function ToggleBtn(props) {
  const [checked = true, setChecked] = useState(true);
  const { text } = props;
  return (
    <>
      <ToggleButton
        style={{ margin: 1 }}
        size="sm"
        key={'asdada' + text}
        id={`radio-` + text}
        type="checkbox"
        variant={checked ? 'outline-primary' : 'light'}
        name="radio"
        value={checked}
        checked={checked}
        onChange={e => {
          setChecked(!checked);
        }}
      >
        {text}
      </ToggleButton>
    </>
  );
}

function Menu(props) {
  return <div>{props.children}</div>;
}

function MenuSessionsPage(props) {
  return (
    <Menu>
      <ButtonGroup className="mb-2">
        <ToggleBtn text="MX" />
        <ToggleBtn text="SAXS" />
        <ToggleBtn text="EM" />
      </ButtonGroup>
    </Menu>
  );
}
export default function SessionsPage() {
  const { startDate = '20210101', endDate = format(new Date(), 'yyyyMMdd') } = useQueryParams();
  const [{ data, loading, error }] = useAxios(getSessions(startDate, endDate));
  if (loading) return <PageLoading />;
  if (error) throw Error(error);

  return (
    <>
      <MenuSessionsPage />
      <SessionTable data={data}></SessionTable>
    </>
  );
}
