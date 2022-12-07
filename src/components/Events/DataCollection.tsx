import React, { PropsWithChildren, useState } from 'react';
import { Container } from 'react-bootstrap';
import { FileEarmark, Link45deg } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import { DataCollection as DataCollectionType, Event } from 'models/Event.d';
import { ProcessingStatuses as ProcessingStatusesType } from 'models/ProcessingStatusesList.d';
import { AutoProcProgramMessageStatus as AutoProcProgramMessageStatusType } from 'models/AutoProcProgramMessageStatuses.d';
import { EventHeader, IButtonProps } from './Events';
import { DataCollectionFileAttachmentsModal } from './DataCollectionFileAttachments';
import { ProcessingStatuses } from './Processing';
import MessageStatus from './MessageStatus';
import Workflow from './Workflow';

import Default from './DataCollections/Default';
import Mesh from './DataCollections/Mesh';
import EM from './DataCollections/EM';
import SSX from './DataCollections/SSX/SSX';

function renderInner({
  item,
  parent,
  processingStatuses,
  messageStatuses,
}: {
  item: DataCollectionType;
  parent: Event;
  processingStatuses?: ProcessingStatusesType;
  messageStatuses?: AutoProcProgramMessageStatusType;
}) {
  const renderMap: Record<string, any> = {
    Mesh: Mesh,
    EM: EM,
    'SSX-Chip': SSX,
    'SSX-Jet': SSX,
  };

  const Component =
    item.DataCollectionGroup.experimentType &&
    item.DataCollectionGroup.experimentType in renderMap
      ? renderMap[item.DataCollectionGroup.experimentType]
      : Default;

  return (
    <Component
      item={item}
      parent={parent}
      processingStatuses={processingStatuses}
      messageStatuses={messageStatuses}
      isGroup={parent.count > 1}
    />
  );
}

export function DataCollectionBox(
  props: PropsWithChildren<{
    item: DataCollectionType;
    parent: Event;
    processingStatuses?: ProcessingStatusesType;
    messageStatuses?: AutoProcProgramMessageStatusType;
    buttons?: Array<IButtonProps>;
    showProcessing?: boolean;
  }>
) {
  const { item, parent, children, buttons, showProcessing = true } = props;
  const navigate = useNavigate();
  const [showAttachments, setShowAttachments] = useState<boolean>(false);

  const groupOrId = {
    ...(parent.count > 1
      ? {
          dataCollectionGroupId: item.DataCollectionGroup.dataCollectionGroupId,
        }
      : null),
    ...(parent.count === 1
      ? { dataCollectionId: item.dataCollectionId }
      : null),
  };

  return (
    <>
      <DataCollectionFileAttachmentsModal
        onHide={() => setShowAttachments(false)}
        show={showAttachments}
        {...groupOrId}
      />
      <EventHeader
        event={parent}
        title={[item.imageDirectory, item.fileTemplate]
          .filter((s) => s)
          .join('/')}
        buttons={
          buttons
            ? buttons
            : [
                {
                  icon: <Link45deg />,
                  hint: 'Permalink',
                  onClick: () =>
                    navigate(
                      parent.count > 1
                        ? '?dataCollectionGroupId=' +
                            item.DataCollectionGroup.dataCollectionGroupId
                        : '?dataCollectionId=' + item.dataCollectionId
                    ),
                },
                {
                  icon: <FileEarmark />,
                  content: <>{parent.attachments}</>,
                  hint: 'Attachments',
                  disabled: parent.attachments === 0,
                  onClick: () => setShowAttachments(true),
                },
                {
                  icon: <MessageStatus statuses={props.messageStatuses} />,
                  variant: 'outline-light',
                  hint: 'Processing Status Messages',
                  hidden:
                    !props.messageStatuses ||
                    (props.messageStatuses?.errors === 0 &&
                      props.messageStatuses?.warnings === 0),
                },
              ]
        }
      />
      <Container fluid className="g-0">
        {children}
      </Container>
      {item.DataCollectionGroup.Workflow && parent.count > 1 && (
        <Workflow {...item.DataCollectionGroup.Workflow} />
      )}
      {showProcessing ? (
        <ProcessingStatuses
          statuses={props.processingStatuses}
          dataCollectionId={parent.id}
        />
      ) : null}
    </>
  );
}

export default function DataCollection(props: {
  item: DataCollectionType;
  parent: Event;
  processingStatuses?: ProcessingStatusesType;
  messageStatuses?: AutoProcProgramMessageStatusType;
}) {
  const { item, parent, processingStatuses, messageStatuses } = props;
  return renderInner({ item, parent, processingStatuses, messageStatuses });
}
