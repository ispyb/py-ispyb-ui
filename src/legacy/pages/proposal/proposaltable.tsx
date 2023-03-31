import { Proposal } from 'legacy/pages/model';
import {
  Badge,
  Button,
  Tooltip,
  OverlayTrigger,
  Container,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TanstackBootstrapTable } from 'components/Layout/TanstackBootstrapTable';

export default function ProposalTable({
  data,
}: {
  data: Proposal[];
  variant: 'sessions' | 'experiments';
}) {
  const columns: ColumnDef<Proposal>[] = [
    {
      header: '',
      accessorKey: 'Proposal_proposalId',
      cell: (info) => {
        return <ProposalSessions proposal={info.row.original} />;
      },
      enableColumnFilter: false,
    },
    {
      header: 'Proposal',
      footer: 'Proposal',
      accessorFn: (row) =>
        `${row.Proposal_proposalCode}${row.Proposal_proposalNumber}`,
      cell: (info) => <ProposalName proposal={info.row.original} />,
    },
    {
      header: 'Title',
      footer: 'Title',
      accessorKey: 'Proposal_title',
    },
  ];

  const table = useReactTable({
    data: data,
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
      <TanstackBootstrapTable table={table} />
    </Container>
  );
}

export function ProposalName({ proposal }: { proposal: Proposal }) {
  return (
    <>
      <p style={{ fontSize: 15, fontWeight: 'bold', margin: 'auto' }}>
        <Badge
          bg="secondary"
          style={{ marginRight: 5 }}
        >{`${proposal.Proposal_proposalType}`}</Badge>
        {`${proposal.Proposal_proposalCode}${proposal.Proposal_proposalNumber}`}
      </p>
    </>
  );
}

export function ProposalSessions({ proposal }: { proposal: Proposal }) {
  const navigate = useNavigate();
  const proposalName = `${proposal.Proposal_proposalCode}${proposal.Proposal_proposalNumber}`;
  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip>Open {proposalName}</Tooltip>}
    >
      <Button
        variant="link"
        onClick={() => {
          navigate(`/legacy/proposals/${proposalName}/sessions`);
        }}
      >
        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
      </Button>
    </OverlayTrigger>
  );
}
