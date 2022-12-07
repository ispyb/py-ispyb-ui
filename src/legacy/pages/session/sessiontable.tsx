import React from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import useResponsiveColumns from 'legacy/hooks/bootstraptable';
import SessionTableMenu from 'legacy/pages/session/sessiontablemenu';
import SessionTableColumns from 'legacy/pages/session/sessiontablecolumns';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Session } from 'legacy/pages/model';
import filterFactory from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface Props {
  data?: Session[];
  areMXColumnsVisible: boolean;
  areSAXSColumnsVisible: boolean;
  areEMColumnsVisible: boolean;
  setAreMXColumnsVisible: (_: boolean) => void;
  setAreSAXSColumnsVisible: (_: boolean) => void;
  setAreEMColumnsVisible: (_: boolean) => void;
  startDate?: string;
  // eslint-disable-next-line no-unused-vars
  setStartDate?: (_: string) => void;
  endDate?: string;
  // eslint-disable-next-line no-unused-vars
  setEndDate?: (_: string) => void;
  userPortalLink: {
    visible: boolean;
    header: string;
    url: string;
    toolTip: string;
  };
  showDatePicker?: boolean;
  showEmptySessions: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowEmptySessions: (_: boolean) => void;
}

export default function SessionTable({
  data,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  areMXColumnsVisible,
  areSAXSColumnsVisible,
  areEMColumnsVisible,
  setAreMXColumnsVisible,
  setAreSAXSColumnsVisible,
  setAreEMColumnsVisible,
  userPortalLink,
  showDatePicker = true,
  showEmptySessions,
  setShowEmptySessions,
}: Props) {
  const responsiveColumns = useResponsiveColumns(
    SessionTableColumns({
      areMXColumnsVisible,
      areSAXSColumnsVisible,
      areEMColumnsVisible,
      userPortalLink,
    })
  );

  return (
    <>
      <SessionTableMenu
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        showDatePicker={showDatePicker}
        showEmptySessions={showEmptySessions}
        setShowEmptySessions={setShowEmptySessions}
        checkList={[
          {
            value: 'MX',
            checked: areMXColumnsVisible,
            onClick: () => setAreMXColumnsVisible(!areMXColumnsVisible),
          },
          {
            value: 'EM',
            checked: areEMColumnsVisible,
            onClick: () => setAreEMColumnsVisible(!areEMColumnsVisible),
          },
          {
            value: 'SAXS',
            checked: areSAXSColumnsVisible,
            onClick: () => setAreSAXSColumnsVisible(!areSAXSColumnsVisible),
          },
        ]}
      />
      {data && data.length ? (
        <BootstrapTable
          bootstrap4
          filter={filterFactory()}
          keyField="SessionTableToolkitProvider"
          data={data}
          columns={responsiveColumns}
          pagination={paginationFactory({ showTotal: true, sizePerPage: 20 })}
        />
      ) : (
        <Alert variant="info">
          <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 10 }} />
          No session found.
        </Alert>
      )}
    </>
  );
}
