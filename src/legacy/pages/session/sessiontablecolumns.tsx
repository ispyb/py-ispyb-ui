import { Badge, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useGetTechniqueByBeamline } from 'legacy/hooks/site';
import { formatDateTo } from 'legacy/helpers/dateparser';
import { Session } from 'legacy/pages/model';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { EditComments } from 'legacy/components/EditComments';
import { updateSessionComments } from 'legacy/api/ispyb';

const dateFormatter = (row: Session) => {
  return `${formatDateTo(
    row.BLSession_startDate,
    'dd/MM/yyyy'
  )} ⇨ ${formatDateTo(row.BLSession_endDate, 'dd/MM/yyyy')}`;
};

export function SessionSearch({ session }: { session: Session }) {
  const technique = useGetTechniqueByBeamline(session.beamLineName);
  const url = `/legacy/proposals/${session.Proposal_proposalCode}${session.Proposal_ProposalNumber}/${technique}/${session.sessionId}/summary`;

  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip>Open session {session.sessionId}</Tooltip>}
    >
      <Link to={url}>
        <Button variant="link">
          <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
        </Button>
      </Link>
    </OverlayTrigger>
  );
}

const getProposalName = (row: Session) => {
  return row.Proposal_proposalCode + row.Proposal_ProposalNumber;
};
const statsFormatter = (cell: any) => {
  const nb = parseFloat(cell.getValue());
  return !isNaN(nb) && nb > 0 ? <Badge bg="info">{nb}</Badge> : '-';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proposalFormatter = (
  session: Session,
  userPortalLink: {
    visible: boolean;
    header: string;
    url: string;
    toolTip: string;
  }
) => {
  const renderTooltip = (
    <Tooltip id="button-tooltip">{userPortalLink.toolTip}</Tooltip>
  );

  if (userPortalLink.visible && session.expSessionPk !== null) {
    return (
      <>
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <a href={userPortalLink.url + session.expSessionPk}>
            <FontAwesomeIcon
              icon={faBook}
              style={{ marginRight: 10 }}
            ></FontAwesomeIcon>
          </a>
        </OverlayTrigger>
        {getProposalName(session)}
      </>
    );
  }
  return getProposalName(session);
};

interface Props {
  areMXColumnsVisible: boolean;
  areEMColumnsVisible: boolean;
  userPortalLink: {
    visible: boolean;
    header: string;
    url: string;
    toolTip: string;
  };
}
export default function columns(props: Props): ColumnDef<Session>[] {
  const { areMXColumnsVisible, areEMColumnsVisible, userPortalLink } = props;
  const MXColumns = [
    {
      header: 'En. Scans',
      footer: 'En. Scans',
      accessorKey: 'energyScanCount',
      enableColumnFilter: false,
      cell: statsFormatter,
    },
    {
      header: 'XRF',
      footer: 'XRF',
      accessorKey: 'xrfSpectrumCount',
      enableColumnFilter: false,
      cell: statsFormatter,
    },
    {
      header: 'Samples',
      footer: 'Samples',
      accessorKey: 'sampleCount',
      enableColumnFilter: false,
      cell: statsFormatter,
    },
    {
      header: 'Tests',
      footer: 'Tests',
      accessorKey: 'testDataCollectionGroupCount',
      enableColumnFilter: false,
      cell: statsFormatter,
    },
    {
      header: 'Collects',
      footer: 'Collects',
      accessorKey: 'dataCollectionGroupCount',
      enableColumnFilter: false,
      cell: statsFormatter,
    },
  ];
  const EMColumns = [
    {
      header: 'Grid Squares',
      footer: 'Grid Squares',

      accessorKey: 'EMdataCollectionGroupCount',
      enableColumnFilter: false,
      cell: statsFormatter,
    },
  ];
  return [
    {
      id: 'open',
      accessorKey: 'sessionId',
      cell: (info) => (
        <SessionSearch session={info.row.original}></SessionSearch>
      ),
      enableColumnFilter: false,
      header: '',
    },
    {
      header: 'Date',
      footer: 'Date',
      cell: (info) => dateFormatter(info.row.original),
      accessorKey: 'BLSession_startDate',
      enableColumnFilter: false,
    },
    {
      header: 'Beamline',
      footer: 'Beamline',

      accessorKey: 'beamLineName',
    },
    {
      header: 'Proposal',
      footer: 'Proposal',

      accessorFn: (session) => getProposalName(session),
      cell: (info) => proposalFormatter(info.row.original, userPortalLink),
    },
    {
      header: 'Local Contact',
      footer: 'Local Contact',

      accessorKey: 'beamLineOperator',
    },

    ...(areMXColumnsVisible ? MXColumns : []),
    ...(areEMColumnsVisible ? EMColumns : []),

    {
      header: 'Comments',
      footer: 'Comments',

      accessorKey: 'comments',
      cell: (info) => (
        <EditComments
          comments={(info.getValue() as string) || ''}
          proposalName={
            info.row.original.Proposal_proposalCode +
            info.row.original.Proposal_ProposalNumber
          }
          id={info.row.original.sessionId?.toString() || ''}
          saveReq={updateSessionComments}
        />
      ),
    },
  ];
}
