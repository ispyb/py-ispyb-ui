import { useSuspense } from 'rest-hooks';

import { ErrorsResource } from 'api/resources/Stats/Errors';
import { usePath } from 'hooks/usePath';
import Table from 'components/Layout/Table';
import { ExperimentTypeGroup } from '../../models/Errors';

function MessageTable(row: ExperimentTypeGroup) {
  return (
    <>
      {row.messages.length > 0 && (
        <Table
          keyId="message"
          results={row.messages}
          columns={[
            { label: 'Count', key: 'count' },
            { label: 'Message', key: 'message' },
          ]}
          emptyText="No errors yet"
        />
      )}
    </>
  );
}

export default function StatusOverview() {
  const sessionId = usePath('sessionId');
  const errors = useSuspense(ErrorsResource.list(), { sessionId });

  return (
    <>
      <h2>Errors</h2>
      <Table
        keyId="experimentType"
        results={errors.totals}
        columns={[
          {
            label: 'Experiment Type',
            key: 'experimentType',
            className: 'text-nowrap',
          },
          { label: 'Total', key: 'total' },
          {
            label: 'Aborted',
            key: 'aborted',
            className: 'text-nowrap',
            formatter: (row: ExperimentTypeGroup) =>
              `${row.aborted} (${row.abortedPercent}%)`,
          },
          {
            label: 'Failed',
            key: 'failed',
            className: 'text-nowrap',
            formatter: (row: ExperimentTypeGroup) =>
              `${row.failed} (${row.failedPercent}%)`,
          },
          { label: 'Messages', key: 'messages', formatter: MessageTable },
        ]}
        emptyText="No errors yet"
      />
    </>
  );
}
