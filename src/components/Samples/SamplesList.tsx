import { useController, useSuspense } from 'rest-hooks';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Table from 'components/Layout/Table';
import { toPrecision } from 'components/Layout/TableCells';
import Search from 'components/Layout/Search';
import { SampleResource } from 'api/resources/Sample';
import { Sample } from 'models/Sample';
import { usePath } from 'hooks/usePath';
import { usePaging } from 'hooks/usePaging';
import { useSearch } from 'hooks/useSearch';
import Filter from 'components/Filter';
import { useSchema } from 'hooks/useSpec';
import SampleStatus, { DCTypes } from './SampleStatus';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import {
  CreateSampleModal,
  EditSampleModal,
  RemoveSampleButton,
} from './editor/SamplesEditor';

function SampleStatusFilter({ urlKey }: { urlKey: string }) {
  const schema = useSchema('SampleStatus', 'Sample Status');
  // @ts-ignore
  const filterTypes = schema.components.schemas.SampleStatus.enum.map(
    (status: string) => ({
      filterKey: status,
      filterValue: status,
    })
  );

  return <Filter urlKey={urlKey} filters={filterTypes} />;
}

interface ISamplesList {
  proteinId?: string;
  focusSearch?: boolean;
}

export default function SamplesList({ proteinId, focusSearch }: ISamplesList) {
  const [searchParams] = useSearchParams();
  const { skip, limit } = usePaging(10, 0, 'samples');
  const search = useSearch();
  const navigate = useNavigate();
  const proposal = usePath('proposal');
  const status = searchParams.get('status');
  const samplesRequestParams = {
    skip,
    limit,
    ...(proposal ? { proposal } : {}),
    ...(proteinId ? { proteinId } : {}),
    ...(search ? { search } : null),
    ...(status ? { status } : null),
  };
  const samples = useSuspense(SampleResource.getList, samplesRequestParams);
  const controller = useController();
  const forceRefresh = () => {
    controller.fetch(SampleResource.getList, samplesRequestParams);
  };
  const [editing, setEditing] = useState(false);

  const onRowClick = (row: Sample) => {
    navigate(`/proposals/${proposal}/samples/${row.blSampleId}`);
  };

  return (
    <section>
      <h1>
        Samples
        <Button
          size="sm"
          style={{ marginLeft: 10 }}
          onClick={() => {
            setEditing(!editing);
          }}
        >
          {editing ? 'Stop edition' : 'Edit'}
        </Button>
        <CreateSampleModal onDone={forceRefresh} />
      </h1>
      <SampleStatusFilter urlKey="status" />
      <Search focus={focusSearch} />
      <Table
        key={'samples'}
        keyId="blSampleId"
        results={samples.results}
        onRowClick={editing ? undefined : onRowClick}
        paginator={{
          total: samples.total,
          skip: samples.skip,
          limit: samples.limit,
          suffix: 'samples',
        }}
        columns={[
          { label: 'Name', key: 'name' },
          { label: 'Protein', key: 'Crystal.Protein.acronym' },
          { label: 'Sub Samples', key: '_metadata.subsamples' },
          { label: 'Container', key: 'Container.code' },
          {
            label: '# DCs',
            key: '_metadata.datacollections',
          },
          {
            label: 'DC Types',
            key: '_metadata.types',
            formatter: (row) => <DCTypes {...row} />,
          },
          {
            label: 'Resolution',
            key: '_metadata.integratedResolution',
            formatter: toPrecision(2),
          },
          {
            label: 'Status',
            key: 'sampleStatus',
            formatter: (row) => <SampleStatus {...row} />,
          },
          ...(editing
            ? [
                {
                  label: '',
                  key: 'edit',
                  formatter: (row: Sample) => <EditSampleModal sample={row} />,
                  headerStyle: { width: 0 },
                },
                {
                  label: '',
                  key: 'remove',
                  formatter: (row: Sample) => (
                    <RemoveSampleButton sample={row} />
                  ),
                  headerStyle: { width: 0 },
                },
              ]
            : []),
        ]}
        emptyText="No samples yet"
      />
    </section>
  );
}
