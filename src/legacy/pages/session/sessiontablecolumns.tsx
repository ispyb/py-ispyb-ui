import { Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { formatDateTo } from 'legacy/helpers/dateparser';
import { Session } from 'legacy/pages/model';
import { ColumnDef } from '@tanstack/react-table';
import { EditComments } from 'legacy/components/EditComments';
import { updateSessionComments } from 'legacy/api/ispyb';

const dateFormatter = (row: Session) => {
  return `${formatDateTo(
    row.BLSession_startDate,
    'dd/MM/yyyy'
  )} ⇨ ${formatDateTo(row.BLSession_endDate, 'dd/MM/yyyy')}`;
};

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
          <a
            href={userPortalLink.url + session.expSessionPk}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
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
  const { areMXColumnsVisible, userPortalLink } = props;
  const MXColumns = [
    {
      header: 'Energy scans',
      footer: 'Energy scans',
      accessorKey: 'energyScanCount',
      enableColumnFilter: false,
      cell: statsFormatter,
    },
    {
      header: 'XRF scans',
      footer: 'XRF scans',
      accessorKey: 'xrfSpectrumCount',
      enableColumnFilter: false,
      cell: statsFormatter,
    },
  ];
  return [
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
    {
      header: 'Samples analysed',
      footer: 'Samples analysed',
      accessorKey: 'sampleCount',
      enableColumnFilter: false,
      cell: statsFormatter,
    },
    {
      header: 'Acquisitions',
      footer: 'Acquisitions',
      accessorKey: 'dataCollectionGroupCount',
      enableColumnFilter: false,
      cell: statsFormatter,
    },
    ...(areMXColumnsVisible ? MXColumns : []),

    {
      header: 'Comments',
      footer: 'Comments',

      accessorKey: 'comments',
      cell: (info) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <EditComments
            comments={(info.getValue() as string) || ''}
            proposalName={
              info.row.original.Proposal_proposalCode +
              info.row.original.Proposal_ProposalNumber
            }
            id={info.row.original.sessionId?.toString() || ''}
            saveReq={updateSessionComments}
          />
        </div>
      ),
    },
  ];
}
