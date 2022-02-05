import React from 'react';
import BootstrapTable2 from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min';
import { SET_SESSIONS_MX_COLUMNS, SET_SESSIONS_SAXS_COLUMNS, SET_SESSIONS_EM_COLUMNS } from 'redux/actiontypes';
import { setTechniqueVisibleSessionTable } from 'redux/actions/ui';
import useResponsiveColumns from 'hooks/bootstraptable';
import SessionTableMenu from 'pages/session/sessiontablemenu';
import SessionTableColumns from 'pages/session/sessiontablecolumns';

const { SearchBar } = Search;

export default function SessionTable(props) {
  const { data, areMXColumnsVisible = true, areSAXSColumnsVisible = true, areEMColumnsVisible = true, startDate, endDate, userPortalLink } = props;
  const responsiveColumns = useResponsiveColumns(
    SessionTableColumns({
      areMXColumnsVisible,
      areSAXSColumnsVisible,
      areEMColumnsVisible,
      userPortalLink,
    })
  );

  return (
    <ToolkitProvider keyField="SessionTableToolkitProvider" data={data} columns={responsiveColumns} search={{ searchFormatted: true }}>
      {(props) => (
        <>
          <SessionTableMenu
            searchMenu={<SearchBar {...props.searchProps} />}
            startDate={startDate}
            endDate={endDate}
            showDatePicker={true}
            checkList={[
              { text: 'MX', checked: areMXColumnsVisible, action: setTechniqueVisibleSessionTable, actionType: SET_SESSIONS_MX_COLUMNS },
              { text: 'SAXS', checked: areSAXSColumnsVisible, action: setTechniqueVisibleSessionTable, actionType: SET_SESSIONS_SAXS_COLUMNS },
              { text: 'EM', checked: areEMColumnsVisible, action: setTechniqueVisibleSessionTable, actionType: SET_SESSIONS_EM_COLUMNS },
            ]}
          />
          <BootstrapTable2 {...props.baseProps} />
        </>
      )}
    </ToolkitProvider>
  );
}
