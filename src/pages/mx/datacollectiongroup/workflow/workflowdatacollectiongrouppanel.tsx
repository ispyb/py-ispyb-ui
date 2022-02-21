import { getWorkflowImage } from 'api/ispyb';
import ZoomImage from 'components/image/zoomimage';
import _ from 'lodash';
import { DataCollectionGroup } from 'pages/mx/model';
import { Col, Row, Button, Badge, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function WorkflowDataCollectionGroupPanel({ dataCollectionGroup }: { dataCollectionGroup: DataCollectionGroup }) {
  if (dataCollectionGroup.Workflow_workflowId) {
    const [thumbnails, descriptions] = _(dataCollectionGroup.WorkflowStep_workflowStepId?.split(',') || [])
      .zip(dataCollectionGroup.WorkflowStep_workflowStepType?.split(',') || [], dataCollectionGroup.WorkflowStep_status?.split(',') || [])
      .map(([id, type, status]) => [<WorkflowThumbnail id={id}></WorkflowThumbnail>, <WorkflowDescription type={type} status={status}></WorkflowDescription>])
      .unzip()
      .value();

    return (
      <Container fluid>
        <Row>{thumbnails}</Row>
        <Row>{descriptions}</Row>
      </Container>
    );
  }
  return <Col></Col>;
}

type Param = {
  proposalName: string;
};
function WorkflowThumbnail({ id }: { id: string | undefined }) {
  const { proposalName = '' } = useParams<Param>();
  if (id) {
    return (
      <Col style={{ textAlign: 'center', margin: 'auto' }}>
        <ZoomImage style={{ maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }} src={getWorkflowImage({ proposalName, stepId: id }).url}></ZoomImage>
      </Col>
    );
  }
  return null;
}

function WorkflowDescription({ type, status }: { type: string | undefined; status: string | undefined }) {
  if (type && status) {
    return (
      <Col style={{ textAlign: 'center', marginBottom: 10 }}>
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
