import { Suspense } from 'react';
import { useSuspense } from 'rest-hooks';
import { Modal } from 'react-bootstrap';
import { Download } from 'react-bootstrap-icons';

import { AutoProcProgramAttachment } from 'models/AutoProcProgramAttachment.d';
import { AutoProcProgramAttachmentResource } from 'api/resources/Processing/AutoProcProgramAttachment';
import Table from 'components/Layout/Table';
import Loading from 'components/Loading';
import ButtonFileViewer from 'components/FileViewer';
import { useSign } from 'hooks/useSign';
import { useAuth } from 'hooks/useAuth';

function ActionsCell(row: AutoProcProgramAttachment) {
  const { signHandler } = useSign();
  const { site } = useAuth();

  return (
    <>
      {['Log', 'Input', 'Debug'].includes(row.fileType) && (
        <ButtonFileViewer
          buttonClasses="me-1"
          url={row._metadata.url}
          title={`View Attachment: ${row.fileName}`}
        />
      )}
      <a
        href={site.host + row._metadata.url}
        className="btn btn-primary btn-sm"
        onClick={(e) => signHandler(e)}
      >
        <Download />
      </a>
    </>
  );
}

export function AutoProcProgramAttachments({
  autoProcProgramId,
}: {
  autoProcProgramId: number;
}) {
  const attachments = useSuspense(AutoProcProgramAttachmentResource.list(), {
    skip: 0,
    limit: 10,
    autoProcProgramId,
  });

  return (
    <Table
      keyId="autoProcProgramAttachmentId"
      results={attachments.results}
      paginator={{
        total: attachments.total,
        skip: attachments.skip,
        limit: attachments.limit,
      }}
      columns={[
        { label: 'Name', key: 'fileName', className: 'text-break' },
        { label: 'Type', key: 'fileType', className: 'text-nowrap' },
        {
          label: '',
          key: 'actions',
          formatter: ActionsCell,
          className: 'text-end text-nowrap',
        },
      ]}
      emptyText="No attachments yet"
    />
  );
}

export function AutoProcProgramAttachmentsModal({
  autoProcProgramId,
  show,
  onHide,
}: {
  autoProcProgramId: number;
  show?: boolean;
  onHide?: () => void;
}) {
  return (
    <Modal
      size="lg"
      fullscreen="sm-down"
      show={show}
      onHide={onHide}
      title="Attachments"
    >
      <Modal.Header closeButton>
        <Modal.Title>Attachments</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Suspense fallback={<Loading />}>
          <AutoProcProgramAttachments autoProcProgramId={autoProcProgramId} />
        </Suspense>
      </Modal.Body>
    </Modal>
  );
}
