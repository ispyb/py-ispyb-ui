import React from 'react';
import useAxios from 'axios-hooks';
import { getSessions } from 'api/ispyb';
import { SessionTable } from 'pages/session/SessionTable';
import format from 'date-fns/format';
import PageLoading from 'components/pageloading';
import useQueryParams from 'hooks/usequeyparams';

export default function SessionsPage() {
  const { startDate = '20210101', endDate = format(new Date(), 'yyyyMMdd') } = useQueryParams();
  const [{ data, loading, error }] = useAxios(getSessions(startDate, endDate));
  if (loading) return <PageLoading />;
  if (error) throw Error(error);

  return <SessionTable data={data}></SessionTable>;
}
