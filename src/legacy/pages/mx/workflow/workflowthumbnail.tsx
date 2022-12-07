import { getWorkflowImage } from 'legacy/api/ispyb';
import ZoomImage from 'legacy/components/image/zoomimage';
import { Container, Row } from 'react-bootstrap';
import { WorkflowStep } from '../model';

export default function WorkflowThumbnail({
  step,
  stepId,
  proposalName,
}: {
  step: WorkflowStep;
  stepId: string;
  proposalName: string;
}) {
  return (
    <Container fluid style={{ height: '100%' }}>
      <Row style={{ height: '80%' }}>
        <ZoomImage
          style={{ margin: 'auto', width: '80%' }}
          src={getWorkflowImage({ proposalName, stepId }).url}
        ></ZoomImage>
      </Row>
      <Row style={{ height: '20%', textAlign: 'center' }}>
        <p>{step.type}</p>
      </Row>
    </Container>
  );
}
