import { useSuspense } from 'rest-hooks';

import { SubSampleResource } from 'api/resources/SubSample';
import Table from 'components/Layout/Table';
import { SubSample } from 'models/SubSample';

export default function SubSampleList({
  blSampleId,
  selectSubSample,
}: {
  blSampleId: number;
  selectSubSample: (blubSampleId: number) => void;
}) {
  const subsamples = useSuspense(SubSampleResource.list(), { blSampleId });

  const onRowClick = (row: SubSample) => {
    selectSubSample(row.blSubSampleId);
  };

  return (
    <>
      <Table
        keyId="blSubSampleId"
        results={subsamples.results}
        onRowClick={onRowClick}
        paginator={{
          total: subsamples.total,
          skip: subsamples.skip,
          limit: subsamples.limit,
        }}
        columns={[
          { label: '#', key: 'blSubSampleId', className: 'text-break' },
          { label: 'Type', key: 'type', className: 'text-nowrap' },
          {
            label: 'Data',
            key: '_metadata.datacollections',
            className: 'text-nowrap',
          },
          {
            label: 'DC Types',
            key: '_metadata.types',
            className: 'text-nowrap',
          },
        ]}
        emptyText="No sub samples yet"
      />
    </>
  );
}
