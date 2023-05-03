import { Proposal } from 'legacy/pages/model';
import { Badge, Container } from 'react-bootstrap';
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
  const navigate = useNavigate();

  const proposalClick = (proposal: Proposal) => {
    const proposalName = `${proposal.Proposal_proposalCode}${proposal.Proposal_proposalNumber}`;
    navigate(`/legacy/proposals/${proposalName}/sessions`);
  };

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
    <Container fluid>
      <TanstackBootstrapTable table={table} onRowClick={proposalClick} />
    </Container>
  );
}

export function ProposalName({ proposal }: { proposal: Proposal }) {
  return (
    <>
      <p style={{ fontSize: 15, fontWeight: 'bold', margin: 'auto' }}>
        <Badge
          bg="primary"
          style={{ marginRight: 5 }}
        >{`${proposal.Proposal_proposalType}`}</Badge>
        {`${proposal.Proposal_proposalCode}${proposal.Proposal_proposalNumber}`}
      </p>
    </>
  );
}
