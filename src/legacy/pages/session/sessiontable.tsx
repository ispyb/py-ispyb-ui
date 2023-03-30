import SessionTableMenu from 'legacy/pages/session/sessiontablemenu';
import SessionTableColumns from 'legacy/pages/session/sessiontablecolumns';
import { Session } from 'legacy/pages/model';
import { Alert, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TanstackBootstrapTable } from 'components/Layout/TanstackBootstrapTable';
import { useMemo } from 'react';

interface Props {
  data?: Session[];
  areMXColumnsVisible: boolean;
  areEMColumnsVisible: boolean;
  setAreMXColumnsVisible: (_: boolean) => void;
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
  areEMColumnsVisible,
  setAreMXColumnsVisible,
  setAreEMColumnsVisible,
  userPortalLink,
  showDatePicker = true,
  showEmptySessions,
  setShowEmptySessions,
}: Props) {
  const columns = SessionTableColumns({
    areMXColumnsVisible,
    areEMColumnsVisible,
    userPortalLink,
  });

  const dataTable = useMemo(() => data || [], [data]);

  const table = useReactTable({
    data: dataTable,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <Container>
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
            text: 'MX',
            selected: areMXColumnsVisible,
            onClick: () => setAreMXColumnsVisible(!areMXColumnsVisible),
          },
          {
            text: 'EM',
            selected: areEMColumnsVisible,
            onClick: () => setAreEMColumnsVisible(!areEMColumnsVisible),
          },
        ]}
      />
      {data && data.length ? (
        <TanstackBootstrapTable table={table} />
      ) : (
        <Alert variant="info">
          <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 10 }} />
          No session found.
        </Alert>
      )}
    </Container>
  );
}
