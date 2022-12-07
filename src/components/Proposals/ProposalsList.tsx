import { useSuspense } from 'rest-hooks';
import { useNavigate } from 'react-router-dom';

import Table from 'components/Layout/Table';
import { ProposalResource } from 'api/resources/Proposal';
import { Proposal } from 'models/Proposal';
import { useProposal } from 'hooks/useProposal';
import Search from 'components/Layout/Search';
import { usePaging } from 'hooks/usePaging';
import { useSearch } from 'hooks/useSearch';

export default function ProposalsList({ sortBy }: { sortBy?: string }) {
  const { skip, limit } = usePaging(10);
  const search = useSearch();
  const navigate = useNavigate();
  const proposals = useSuspense(ProposalResource.list(), {
    skip,
    limit,
    ...(search ? { search } : null),
  });
  const { setProposalName } = useProposal();

  const onRowClick = (row: Proposal) => {
    setProposalName(row.proposal);
    navigate(`/proposals/${row.proposal}/sessions`);
  };

  return (
    <section>
      <h1>Proposals</h1>
      <Search focus />
      <Table
        keyId="proposalId"
        results={proposals.results}
        onRowClick={onRowClick}
        paginator={{
          total: proposals.total,
          skip: proposals.skip,
          limit: proposals.limit,
        }}
        columns={[
          { label: 'Proposal', key: 'proposal' },
          { label: 'Title', key: 'title' },
          { label: 'State', key: 'state' },
          { label: '# Sessions', key: '_metadata.sessions' },
        ]}
        emptyText="No proposals yet"
      />
    </section>
  );
}
