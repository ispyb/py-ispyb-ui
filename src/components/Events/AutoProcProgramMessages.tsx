import React from 'react';
import { Modal } from 'react-bootstrap';
import {
  ExclamationCircleFill,
  ExclamationTriangleFill,
  InfoCircleFill,
} from 'react-bootstrap-icons';

import {
  AutoProcProgram as AutoProcProgramType,
  AutoProcProgramMessage as AutoProcProgramMessageType,
} from 'models/AutoProcProgram.d';
import Table from 'components/Layout/Table';

export const messageStatusIcons: Record<string, JSX.Element> = {
  INFO: <InfoCircleFill color="#198754" />,
  WARNING: <ExclamationTriangleFill color="#ffc107" />,
  ERROR: <ExclamationCircleFill color="#dc3545" />,
};

export function AutoProcProgramMessageIcons(props: AutoProcProgramType) {
  const messageTypes = [
    // @ts-ignore
    ...new Set(
      props._metadata.autoProcProgramMessages?.map(
        (message) => message.severity
      )
    ),
  ];

  return (
    <>
      {messageTypes.map((messageType: string) => (
        <React.Fragment key={messageType}>
          {messageStatusIcons[messageType]}
        </React.Fragment>
      ))}
    </>
  );
}

function SeverityCell(row: AutoProcProgramMessageType) {
  return <>{messageStatusIcons[row.severity]}</>;
}

export function AutoProcProgramMessages({
  messages,
}: {
  messages: AutoProcProgramMessageType[];
}) {
  return (
    <Table
      keyId="autoProcProgramMessageId"
      results={messages}
      columns={[
        { label: '', key: 'severity', formatter: SeverityCell },
        { label: 'Message', key: 'message' },
        { label: 'Description', key: 'description' },
      ]}
      emptyText="No messages yet"
    />
  );
}

export function AutoProcProgramMessagesModal({
  messages,
  show,
  onHide,
}: {
  messages: AutoProcProgramMessageType[];
  show?: boolean;
  onHide?: () => void;
}) {
  return (
    <Modal fullscreen="sm-down" show={show} onHide={onHide} title="Messages">
      <Modal.Header closeButton>
        <Modal.Title>Processing Messages</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <AutoProcProgramMessages messages={messages} />
      </Modal.Body>
    </Modal>
  );
}
