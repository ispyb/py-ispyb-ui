import { Suspense } from 'react';
import { useSuspense } from 'rest-hooks';
import { Modal } from 'react-bootstrap';
import { Download } from 'react-bootstrap-icons';

import { DataCollectionFileAttachment } from 'models/DataCollectionFileAttachment.d';
import { DataCollectionFileAttachmentResource } from 'api/resources/DataCollectionFileAttachment';
import Table from 'components/Layout/Table';
import Loading from 'components/Loading';
import ButtonFileViewer from 'components/FileViewer';
import { useSign } from 'hooks/useSign';
import { useAuth } from 'hooks/useAuth';

function ActionsCell(row: DataCollectionFileAttachment) {
  const { signHandler } = useSign();
  const { site } = useAuth();
  return (
    <>
      {['log', 'params'].includes(row.fileType) && (
        <ButtonFileViewer
          buttonClasses="me-1"
          url={row._metadata.url}
          title={`View Attachment: ${row._metadata.fileName}`}
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

export function DataCollectionFileAttachments({
  dataCollectionId,
  dataCollectionGroupId,
}: {
  dataCollectionId?: number;
  dataCollectionGroupId?: number;
}) {
  const attachments = useSuspense(DataCollectionFileAttachmentResource.list(), {
    skip: 0,
    limit: 10,
    ...(dataCollectionId ? { dataCollectionId } : null),
    ...(dataCollectionGroupId ? { dataCollectionGroupId } : null),
  });

  return (
    <Table
      keyId="dataCollectionFileAttachmentId"
      results={attachments.results}
      paginator={{
        total: attachments.total,
        skip: attachments.skip,
        limit: attachments.limit,
      }}
      columns={[
        { label: 'Name', key: '_metadata.fileName', className: 'text-break' },
        { label: 'Type', key: 'fileType' },
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

export function DataCollectionFileAttachmentsModal({
  dataCollectionId,
  dataCollectionGroupId,
  show,
  onHide,
}: {
  dataCollectionId?: number;
  dataCollectionGroupId?: number;
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
          <DataCollectionFileAttachments
            dataCollectionId={dataCollectionId}
            dataCollectionGroupId={dataCollectionGroupId}
          />
        </Suspense>
      </Modal.Body>
    </Modal>
  );
}
