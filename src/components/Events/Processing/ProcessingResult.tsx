import { useState } from 'react';
import { useSuspense } from 'rest-hooks';
import { Button } from 'react-bootstrap';
import { AutoProcProgram as AutoProcProgramType } from 'models/AutoProcProgram.d';
import { AutoProcProgramResource } from 'api/resources/Processing/AutoProcProgram';

import Table from 'components/Layout/Table';
import {
  AutoProcProgramMessageIcons,
  AutoProcProgramMessagesModal,
} from '../AutoProcProgramMessages';
import { AttachmentsButton, statusIcons, statusRunning } from '../Processing';

function StatusCell(row: AutoProcProgramType) {
  return (
    <>
      {row.processingStatus !== undefined &&
        (row.processingStatus === null
          ? statusRunning
          : statusIcons[row.processingStatus])}
    </>
  );
}

export function ActionsCell(row: AutoProcProgramType) {
  const [showMessages, setShowMessages] = useState<boolean>(false);

  return (
    <>
      {row._metadata.autoProcProgramMessages &&
        row._metadata.autoProcProgramMessages.length > 0 && (
          <Button
            size="sm"
            variant="outline-primary"
            className="me-1"
            onClick={() => setShowMessages(true)}
          >
            <AutoProcProgramMessageIcons {...row} />
          </Button>
        )}
      <AttachmentsButton {...row} />

      {row._metadata.autoProcProgramMessages && (
        <AutoProcProgramMessagesModal
          onHide={() => setShowMessages(false)}
          show={showMessages}
          messages={row._metadata.autoProcProgramMessages}
        />
      )}
    </>
  );
}

export default function ProcessingResult({
  dataCollectionId,
}: {
  dataCollectionId: number;
}) {
  const processings = useSuspense(AutoProcProgramResource.list(), {
    dataCollectionId,
  });

  return (
    <Table
      size="sm"
      keyId="autoProcProgramId"
      results={processings.results}
      columns={[
        { label: 'Program', key: 'processingPrograms' },
        { label: '', key: 'processingStatus', formatter: StatusCell },
        { label: 'Comments', key: 'ProcessingJob?.comments' },
        { label: 'Message', key: 'processingMessage' },
        { label: 'Start', key: 'processingStartTime' },
        { label: 'End', key: 'processingEndTime' },
        {
          label: '',
          key: 'actions',
          formatter: ActionsCell,
          className: 'text-end',
        },
      ]}
      emptyText="No processings yet"
    />
  );
}
