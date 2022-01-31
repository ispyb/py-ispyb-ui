import React from 'react';
import { useSession } from 'hooks/ispyb';
import SessionTable from 'pages/session/sessiontable';
import format from 'date-fns/format';
import useQueryParams from 'hooks/usequeyparams';
import SessionTableMenu from 'pages/session/sessiontablemenu';
import { useAppSelector } from 'hooks';
import { setTechniqueVisibleSessionTable } from 'redux/actions/ui';
import { SET_SESSIONS_MX_COLUMNS, SET_SESSIONS_SAXS_COLUMNS, SET_SESSIONS_EM_COLUMNS } from 'redux/actiontypes';
import { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min';
import UI from 'config/ui';

export default function SessionsPage() {
  const { SearchBar } = Search;
  const { areEMColumnsVisible, areMXColumnsVisible, areSAXSColumnsVisible } = useAppSelector((state) => state.ui.sessionsPage);

  const { startDate = format(new Date(), 'yyyyMMdd'), endDate = format(new Date(Date.now() + 3600 * 1000 * 24), 'yyyyMMdd') } = useQueryParams();
  const { data, error } = useSession(startDate, endDate);

  if (error) throw Error(error);

  return (
    <>
      <SessionTable
        startDate={startDate}
        endDate={endDate}
        menu={
          <SessionTableMenu
            items={[
              { text: 'MX', checked: areMXColumnsVisible, action: setTechniqueVisibleSessionTable, actionType: SET_SESSIONS_MX_COLUMNS },
              { text: 'SAXS', checked: areSAXSColumnsVisible, action: setTechniqueVisibleSessionTable, actionType: SET_SESSIONS_SAXS_COLUMNS },
              { text: 'EM', checked: areEMColumnsVisible, action: setTechniqueVisibleSessionTable, actionType: SET_SESSIONS_EM_COLUMNS },
            ]}
            SearchMenu={SearchBar}
          />
        }
        search={true}
        data={data}
        areEMColumnsVisible={areEMColumnsVisible}
        areMXColumnsVisible={areMXColumnsVisible}
        areSAXSColumnsVisible={areSAXSColumnsVisible}
        userPortalLink={UI.sessionsPage.userPortalLink}
      ></SessionTable>
    </>
  );
}
