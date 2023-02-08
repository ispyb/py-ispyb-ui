import { Suspense, useState } from 'react';
import { Badge, Button, Modal } from 'react-bootstrap';
import { Gear, Search, Collection } from 'react-bootstrap-icons';
import { Link, useSearchParams } from 'react-router-dom';
import { useSubscription, useSuspense } from 'rest-hooks';

import { ContainerQueueSampleResource } from 'api/resources/Queue/ContainerQueueSample';
import { ContainerQueueSample } from 'models/ContainerQueueSample.d';
import NestedObjectTable from 'components/Layout/NestedObjectTable';
import Table from 'components/Layout/Table';
import { DCTypes } from 'components/Samples/SampleStatus';
import SubSampleType from 'components/Samples/SubSampleType';
import StatusBadge from 'components/Events/DataCollections/StatusBadge';
import { usePath } from 'hooks/usePath';
import Filter from 'components/Filter';
import { usePaging } from 'hooks/usePaging';

function ModalParametersTable(row: ContainerQueueSample) {
  const [show, setShow] = useState<boolean>(false);
  return (
    <>
      <Button size="sm" onClick={() => setShow(true)}>
        <Gear />
      </Button>
      <Modal
        size="lg"
        fullscreen="sm-down"
        show={show}
        onHide={() => setShow(false)}
        title="Parameters"
      >
        <Modal.Header closeButton>
          <Modal.Title>Parameters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NestedObjectTable object={row.DiffractionPlan?.scanParameters} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function SampleCell(row: ContainerQueueSample) {
  const blSampleId = row.BLSample
    ? row.BLSample?.blSampleId
    : row.BLSubSample?.BLSample.blSampleId;
  return (
    <div className="d-flex">
      <span className="me-auto">
        {row.BLSample ? row.BLSample?.name : row.BLSubSample?.BLSample.name}{' '}
        {blSampleId}
        {row.BLSubSample && (
          <>
            -{row.blSubSampleId}{' '}
            <SubSampleType className="ms-1" type={row.BLSubSample.type} />
          </>
        )}
      </span>
      <Link
        className="btn btn-primary btn-sm"
        title="View Sample"
        role="button"
        to={`/proposals/${row._metadata.proposal}/samples/${blSampleId}`}
      >
        <Search />
      </Link>
    </div>
  );
}

function DCList(row: ContainerQueueSample) {
  return (
    <Table
      keyId="dataCollectionId"
      results={row._metadata.datacollections}
      columns={[
        { label: 'ID', key: 'dataCollectionId' },
        {
          label: 'Status',
          key: 'runStatus',
          formatter: (row) => <StatusBadge status={row.runStatus} />,
        },
      ]}
    />
  );
}

function CompletedStautsFilter({ urlKey }: { urlKey: string }) {
  return (
    <Filter
      urlKey={urlKey}
      filters={[
        {
          filterKey: 'Failed',
          filterValue: 'failed',
        },
      ]}
    />
  );
}

function SampleQueueMain() {
  const proposal = usePath('proposal');
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const { skip, limit } = usePaging(10);

  const queuedArgs = {
    proposal,
    status: 'Queued',
    order: 'asc',
    skip,
    limit,
  };
  const queued = useSuspense(ContainerQueueSampleResource.list(), queuedArgs);
  useSubscription(ContainerQueueSampleResource.list(), queuedArgs);

  const completedArgs = {
    proposal,
    status: status === 'failed' ? 'Failed' : 'Completed',
    limit: 10,
  };
  const completed = useSuspense(
    ContainerQueueSampleResource.list(),
    completedArgs
  );
  useSubscription(ContainerQueueSampleResource.list(), completedArgs);

  return (
    <>
      <h2>Queued</h2>
      <Table
        keyId="containerQueueSampleId"
        results={queued.results}
        paginator={{
          total: queued.total,
          skip: queued.skip,
          limit: queued.limit,
        }}
        columns={[
          { label: 'ID', key: 'containerQueueSampleId' },
          {
            label: 'Sample',
            key: 'blSubSampleId',
            formatter: (row) => <SampleCell {...row} />,
          },
          { label: 'Created', key: 'DiffractionPlan.recordTimeStamp' },
          {
            label: '',
            key: 'DiffractionPlan.scanParameters',
            formatter: (row) => <ModalParametersTable {...row} />,
            className: 'text-end',
          },
        ]}
        emptyText="No samples queued yet"
      />

      <h2>Completed</h2>
      <CompletedStautsFilter urlKey="status" />
      <Table
        keyId="containerQueueSampleId"
        results={completed.results}
        paginator={{
          total: completed.total,
          skip: completed.skip,
          limit: completed.limit,
        }}
        columns={[
          { label: 'ID', key: 'containerQueueSampleId' },
          {
            label: 'Sample',
            key: 'blSubSampleId',
            formatter: (row) => <SampleCell {...row} />,
          },
          { label: '# DC', key: '_metadata.datacollections.length' },
          { label: 'Started', key: '_metadata.started' },
          {
            label: 'Finished',
            key: '_metadata.finished',
            formatter: (row) =>
              row._metadata.finished || <Badge bg="info">Running</Badge>,
          },
          {
            label: 'DC Type',
            key: '_metadata.types',
            formatter: (row) => <DCTypes {...row} />,
          },
          {
            label: 'DC Status',
            key: '_metadata.datacollections',
            formatter: (row) => <DCList {...row} />,
          },
          {
            label: '',
            key: 'actions',
            className: 'text-end',
            formatter: (row) => (
              <>
                <ModalParametersTable {...row} />
                <Link
                  className="ms-1 btn btn-primary btn-sm"
                  role="button"
                  title="View Data Collection Group"
                  to={`/proposals/${row._metadata.proposal}/sessions/${row._metadata.sessionId}?dataCollectionGroupId=${row._metadata.dataCollectionGroupId}`}
                >
                  <Collection />
                </Link>
                <Link
                  className="ms-1 btn btn-primary btn-sm"
                  role="button"
                  title="View Session"
                  to={`/proposals/${row._metadata.proposal}/sessions/${row._metadata.sessionId}`}
                >
                  <Search />
                </Link>
              </>
            ),
          },
        ]}
        emptyText="No samples completed yet"
      />
    </>
  );
}

export default function SampleQueue() {
  return (
    <Suspense>
      <SampleQueueMain />
    </Suspense>
  );
}
