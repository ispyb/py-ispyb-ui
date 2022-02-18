import { getWorkflowImage } from 'api/ispyb';
import ZoomImage from 'components/image/zoomimage';
import _ from 'lodash';
import { DataCollectionGroup } from 'pages/mx/model';
import { Col, Row, Button, Badge, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function WorkflowDataCollectionGroupPanel({ dataCollectionGroup }: { dataCollectionGroup: DataCollectionGroup }) {
  if (dataCollectionGroup.Workflow_workflowId) {
    return (
      <Container fluid>
        <Row>
          {_.zip(
            dataCollectionGroup.WorkflowStep_workflowStepId?.split(',') || [],
            dataCollectionGroup.WorkflowStep_workflowStepType?.split(',') || [],
            dataCollectionGroup.WorkflowStep_status?.split(',') || []
          ).map(([id, type, status]) => {
            return <WorkflowThumbnail id={id} type={type} status={status}></WorkflowThumbnail>;
          })}
        </Row>
      </Container>
    );
  }
  return <Col></Col>;
}

type Param = {
  proposalName: string;
};
function WorkflowThumbnail({ id, type, status }: { id: string | undefined; type: string | undefined; status: string | undefined }) {
  const { proposalName = '' } = useParams<Param>();
  if (id && type && status) {
    return (
      <Col style={{ textAlign: 'center', marginBottom: 10 }}>
        <ZoomImage src={getWorkflowImage({ proposalName, stepId: id }).url}></ZoomImage>
        <Row>
          <h5>{type}</h5>
        </Row>
        <Row>
          <span>
            <Badge style={{ margin: 10, marginTop: 0 }} bg={getBadgeColor(status)}>
              {status}
            </Badge>
          </span>
        </Row>
        <Button color="primary">Open</Button>
      </Col>
    );
  }
  return null;
}

function getBadgeColor(status: string) {
  if (status.toLocaleLowerCase().includes('success')) {
    return 'success';
  }
  if (status.toLocaleLowerCase().includes('failure')) {
    return 'danger';
  }
  return 'warning';
}
