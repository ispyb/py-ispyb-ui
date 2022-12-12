import React, { Suspense, useState } from 'react';
import { Button } from 'react-bootstrap';
import {
  FileEarmark,
  CheckCircle,
  Exclamation,
  Gear,
  XCircle,
} from 'react-bootstrap-icons';
import {
  ProcessingStatuses as ProcessingStatusesType,
  ProcessingStatus as ProcessingStatusType,
} from 'models/ProcessingStatusesList.d';
import { AutoProcProgram as AutoProcProgramType } from 'models/AutoProcProgram.d';

import { AutoProcProgramAttachmentsModal } from './AutoProcProgramAttachments';
import Loading from 'components/Loading';
import AutoIntegrationResult from './Processing/AutoIntegrationResult';
import ScreeningResult from './Processing/ScreeningResult';
import ProcessingResult from './Processing/ProcessingResult';

export const statusIcons: Record<StatusEnum, JSX.Element> = {
  0: <XCircle color="red" className="ms-1" />,
  1: <CheckCircle color="green" className="ms-1" />,
  2: <Exclamation color="blue" className="ms-1" />,
};
export const statusRunning = <Gear className="ms-1" color="gray" />;

export function AttachmentsButton(row: AutoProcProgramType) {
  const [showAttachments, setShowAttachments] = useState<boolean>(false);
  return (
    <>
      <Button
        size="sm"
        onClick={() => setShowAttachments(true)}
        disabled={row._metadata.attachments === 0}
      >
        <FileEarmark /> {row._metadata.attachments}
      </Button>

      <AutoProcProgramAttachmentsModal
        onHide={() => setShowAttachments(false)}
        show={showAttachments}
        autoProcProgramId={row.autoProcProgramId}
      />
    </>
  );
}

function ProcessingResults(props: {
  dataCollectionId: number;
  processingType: string;
}) {
  return (
    <div className="processing-results border-top p-2">
      <Suspense fallback={<Loading />}>
        {props.processingType === 'screening' && (
          <ScreeningResult dataCollectionId={props.dataCollectionId} />
        )}
        {props.processingType === 'autoIntegration' && (
          <AutoIntegrationResult dataCollectionId={props.dataCollectionId} />
        )}
        {props.processingType === 'processing' && (
          <ProcessingResult dataCollectionId={props.dataCollectionId} />
        )}
      </Suspense>
    </div>
  );
}

function groupStatuses(statuses: ProcessingStatusType[]) {
  const statusCounts: Record<string | number, number> = {};
  statuses.forEach((status) => {
    const statusType = status.status === null ? 'running' : status.status;
    if (statusType !== undefined) {
      if (!(statusType in statusCounts)) statusCounts[statusType] = 0;
      statusCounts[statusType]++;
    }
  });
  return Object.entries(statusCounts).map(
    ([status, count]: [string | number, number]) => (
      <React.Fragment key={status}>
        {count > 1 && <>{count}x</>}
        {status === 'running'
          ? statusRunning
          : statusIcons[status as StatusEnum]}
      </React.Fragment>
    )
  );
}

export type StatusEnum = 0 | 1 | 2;

export function ProcessingStatuses({
  statuses,
  dataCollectionId,
}: {
  statuses?: ProcessingStatusesType;
  dataCollectionId: number;
}) {
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const hasProcessing =
    statuses &&
    Object.entries(statuses)
      .map(([_, value]) => (value !== null ? 1 : 0))
      .reduce((a: number, b: number) => a + b, 0);

  const titles: Record<string, string> = {
    processing: 'Auto Processing',
    autoIntegration: 'Auto Integration',
    screening: 'Screening',
    xrc: 'X-ray Centring',
    em: 'Processing',
  };

  return (
    <div className="processing mt-1 border rounded bg-light">
      {statuses &&
        Object.entries(statuses).map(
          ([statusType, statusTypeValues]: [
            string,
            Record<string, ProcessingStatusType[]>
          ]) => (
            <React.Fragment key={statusType}>
              {statusTypeValues !== null && (
                <>
                  <div
                    className="d-flex justify-content-between p-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      setShowResults((prevState) => ({
                        ...prevState,
                        [statusType]: !showResults[statusType],
                      }))
                    }
                  >
                    <div>{titles[statusType]}</div>
                    <div>
                      {Object.entries(statusTypeValues).map(
                        ([processName, processStatuses]: [
                          string,
                          ProcessingStatusType[]
                        ]) => (
                          <span key={processName} className="ms-2">
                            {processName}:
                            {statusType === 'em' && <>{processStatuses}</>}
                            {statusType !== 'em' && (
                              <>{groupStatuses(processStatuses)}</>
                            )}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  {showResults[statusType] && (
                    <ProcessingResults
                      dataCollectionId={dataCollectionId}
                      processingType={statusType}
                    />
                  )}
                </>
              )}
            </React.Fragment>
          )
        )}

      {!hasProcessing && <div className="p-2">No Processings</div>}
    </div>
  );
}
