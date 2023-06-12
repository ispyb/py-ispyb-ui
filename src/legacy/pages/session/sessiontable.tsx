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
import { getTechniqueByBeamline } from 'legacy/hooks/site';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import _ from 'lodash';
import { parseDate } from 'helpers/dateparser';

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

  const dataTable = useMemo(
    () =>
      _(data)
        .sort((a, b) => {
          const aDate = parseDate(a.BLSession_startDate);
          const bDate = parseDate(b.BLSession_startDate);
          return bDate.getTime() - aDate.getTime();
        })
        .value(),
    [data]
  );

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

  const auth = useAuth();
  const navigate = useNavigate();
  const clickSession = (session: Session) => {
    const technique = getTechniqueByBeamline(auth, session.beamLineName);
    const url = `/legacy/proposals/${session.Proposal_proposalCode}${session.Proposal_ProposalNumber}/${technique}/${session.sessionId}/summary`;
    navigate(url);
  };

  return (
    <Container fluid>
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
        <TanstackBootstrapTable table={table} onRowClick={clickSession} />
      ) : (
        <Alert variant="info">
          <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 10 }} />
          No session found.
        </Alert>
      )}
    </Container>
  );
}
