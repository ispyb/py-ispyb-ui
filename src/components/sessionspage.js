import React from 'react';
import { Card } from 'react-bootstrap';
import useAxios from 'axios-hooks';
import { SessionTable } from './session/SessionTable';

const url = 'https://ispyb.esrf.fr/ispyb/ispyb-ws/rest/e5486299d306217dd36de1b8cd902fb6ca0e38c3/proposal/session/date/20210107/20220108/list';

export default function SessionsPage() {
  const [{ data, loading, error }] = useAxios({ url });
  if (loading) return <p>Loading...</p>;
  if (error) throw Error('An axios error is produced');

  return (
    <Card>
      <>Session Page</>
      <SessionTable data={data}></SessionTable>
    </Card>
  );
}
