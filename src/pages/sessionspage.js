import React from 'react';
import useAxios from 'axios-hooks';
import { getSessions } from 'api/ispyb';
import SessionTable from 'pages/session/sessiontable';
import format from 'date-fns/format';
import PageLoading from 'components/pageloading';
import useQueryParams from 'hooks/usequeyparams';
import SessionTableMenu from 'pages/session/sessiontablemenu';
import { useAppSelector } from 'hooks';
import { setTechniqueVisibleSessionTable } from 'redux/actions/ui';
import { SET_SESSIONS_MX_COLUMNS, SET_SESSIONS_SAXS_COLUMNS, SET_SESSIONS_EM_COLUMNS } from 'redux/actiontypes';

export default function SessionsPage() {
  const today = format(new Date(), 'yyyyMMdd');
  const tomorrow = format(new Date(Date.now() + 3600 * 1000 * 24), 'yyyyMMdd');

  const { areEMColumnsVisible, areMXColumnsVisible, areSAXSColumnsVisible } = useAppSelector((state) => state.ui.options.sessionsPage);

  const { startDate = today, endDate = tomorrow } = useQueryParams();
  const [{ data, loading, error }] = useAxios(getSessions(startDate, endDate));
  if (loading) return <PageLoading />;
  if (error) throw Error(error);

  return (
    <>
      <SessionTableMenu
        items={[
          { text: 'MX', checked: areMXColumnsVisible, action: setTechniqueVisibleSessionTable, actionType: SET_SESSIONS_MX_COLUMNS },
          { text: 'SAXS', checked: areSAXSColumnsVisible, action: setTechniqueVisibleSessionTable, actionType: SET_SESSIONS_SAXS_COLUMNS },
          { text: 'EM', checked: areEMColumnsVisible, action: setTechniqueVisibleSessionTable, actionType: SET_SESSIONS_EM_COLUMNS },
        ]}
      />
      <SessionTable data={data} areEMColumnsVisible={areEMColumnsVisible} areMXColumnsVisible={areMXColumnsVisible} areSAXSColumnsVisible={areSAXSColumnsVisible}></SessionTable>
    </>
  );
}
