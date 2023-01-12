import { useSuspense } from 'rest-hooks';

import { SubSampleResource } from 'api/resources/SubSample';
import Table from 'components/Layout/Table';
import { DCTypes } from 'components/Samples/SampleStatus';
import { SubSample } from 'models/SubSample';
import { usePaging } from 'hooks/usePaging';

export default function SubSampleList({
  blSampleId,
  selectedSubSample,
  selectSubSample,
}: {
  blSampleId: number;
  selectedSubSample: number | undefined;
  selectSubSample: (blubSampleId: number) => void;
}) {
  const { skip, limit } = usePaging(10);
  const subsamples = useSuspense(SubSampleResource.list(), {
    blSampleId,
    skip,
    limit,
  });

  const onRowClick = (row: SubSample) => {
    selectSubSample(row.blSubSampleId);
  };

  return (
    <>
      <Table
        keyId="blSubSampleId"
        results={subsamples.results}
        onRowClick={onRowClick}
        rowClasses={(row: SubSample) =>
          row.blSubSampleId === selectedSubSample ? 'table-active' : undefined
        }
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
            formatter: (row) => <DCTypes {...row} />,
            className: 'text-nowrap',
          },
        ]}
        emptyText="No sub samples yet"
      />
    </>
  );
}
