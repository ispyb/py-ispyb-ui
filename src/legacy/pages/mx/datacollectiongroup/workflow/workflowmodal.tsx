import { faWindowMaximize } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingPanel from 'legacy/components/loading/loadingpanel';
import { useMxWorkflow } from 'legacy/hooks/ispyb';
import WorkflowContent from 'legacy/pages/mx/workflow/workflowcontent';
import { Suspense } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function WorkflowModal({
  show,
  onHide,
  step,
  type,
  url,
  proposalName,
}: {
  proposalName: string;
  step?: string;
  type: string;
  url: string;
  show: boolean;
  onHide: () => void;
}) {
  return (
    <Modal
      onHide={onHide}
      show={show}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{type}</Modal.Title>
        <Link to={url}>
          <Button style={{ marginLeft: 10 }}>
            <FontAwesomeIcon icon={faWindowMaximize}></FontAwesomeIcon>
            Fullscreen
          </Button>
        </Link>
      </Modal.Header>
      <Modal.Body>
        {show && (
          <Suspense fallback={<LoadingPanel></LoadingPanel>}>
            <ModalContent
              proposalName={proposalName}
              step={step}
            ></ModalContent>
          </Suspense>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>{' '}
      </Modal.Footer>
    </Modal>
  );
}

export function ModalContent({
  step = '',
  proposalName,
}: {
  proposalName: string;
  step?: string;
}) {
  const { data } = useMxWorkflow({ proposalName, stepId: step });
  if (data) {
    return <WorkflowContent step={data}></WorkflowContent>;
  }
  return <Alert variant="error">No data found</Alert>;
}
