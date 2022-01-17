import React from 'react';
import useAxios from 'axios-hooks';
import { getSessions } from 'api/ispyb';
import { SessionTable } from 'pages/session/sessiontable';
import format from 'date-fns/format';
import PageLoading from 'components/pageloading';
import useQueryParams from 'hooks/usequeyparams';
import SessionTableMenu from 'pages/session/sessiontablemenu';
import { useAppSelector, useAppDispatch } from 'hooks';

export default function SessionsPage() {
  const today = format(new Date(), 'yyyyMMdd');
  const tomorrow = format(new Date(Date.now() + 3600 * 1000 * 24), 'yyyyMMdd');
  const ui = useAppSelector((state) => state);

  console.log(ui);
  const { startDate = today, endDate = tomorrow } = useQueryParams();
  const [{ data, loading, error }] = useAxios(getSessions(startDate, endDate));
  if (loading) return <PageLoading />;
  if (error) throw Error(error);

  return (
    <>
      <SessionTableMenu />
      <SessionTable data={data}></SessionTable>
    </>
  );
}
