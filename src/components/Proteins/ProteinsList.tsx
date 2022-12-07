import { useSuspense } from 'rest-hooks';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Table from 'components/Layout/Table';
import Search from 'components/Layout/Search';
import { ProteinResource } from 'api/resources/Protein';
import { Protein } from 'models/Protein.d';
import { usePath } from 'hooks/usePath';
import { usePaging } from 'hooks/usePaging';
import { useSearch } from 'hooks/useSearch';
import { enumBadge } from 'components/Layout/TableCells';

export default function ProteinsList() {
  const [searchParams] = useSearchParams();
  const { skip, limit } = usePaging(10);
  const search = useSearch();
  const navigate = useNavigate();
  const proposal = usePath('proposal');
  const status = searchParams.get('status');
  const proteins = useSuspense(ProteinResource.list(), {
    skip,
    limit,
    ...(proposal ? { proposal } : {}),
    ...(search ? { search } : null),
    ...(status ? { status } : null),
  });

  const onRowClick = (row: Protein) => {
    navigate(`/proposals/${proposal}/proteins/${row.proteinId}`);
  };

  const safetyLevels = {
    GREEN: 'success',
    YELLOW: 'warning',
    RED: 'error',
  };

  return (
    <section>
      <h1>Proteins</h1>
      <Search focus />
      <Table
        keyId="proteinId"
        results={proteins.results}
        onRowClick={onRowClick}
        paginator={{
          total: proteins.total,
          skip: proteins.skip,
          limit: proteins.limit,
        }}
        columns={[
          { label: 'Name', key: 'name' },
          { label: 'Acronym', key: 'acronym' },
          { label: 'Samples', key: '_metadata.samples' },
          { label: '# DCs', key: '_metadata.datacollections' },
          {
            label: 'Safety',
            key: 'safetyLevel',
            formatter: enumBadge,
            formatterParams: { enum: safetyLevels },
          },
        ]}
        emptyText="No proteins yet"
      />
    </section>
  );
}
