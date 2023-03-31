import { getMxWorkflowLog, getWorkflowImage } from 'legacy/api/ispyb';
import ZoomImage from 'legacy/components/image/zoomimage';
import _ from 'lodash';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import { useState } from 'react';
import { Col, Row, Button, Badge, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import WorkflowModal from './workflowmodal';
import { openInNewTab } from 'legacy/helpers/opentab';
import { useAuth } from 'hooks/useAuth';

export default function WorkflowDataCollectionGroupPanel({
  dataCollectionGroup,
  proposalName,
}: {
  dataCollectionGroup: DataCollectionGroup;
  proposalName: string;
}) {
  const { site, token } = useAuth();

  if (dataCollectionGroup.Workflow_workflowId) {
    const [thumbnails, descriptions] = _(
      dataCollectionGroup.WorkflowStep_workflowStepId?.split(',') || []
    )
      .zip(
        dataCollectionGroup.WorkflowStep_workflowStepType?.split(',') || [],
        dataCollectionGroup.WorkflowStep_status?.split(',') || []
      )
      .map(([id, type, status]) => [
        <WorkflowThumbnail id={id} key={`thumbnail${id}`}></WorkflowThumbnail>,
        <WorkflowDescription
          key={`description${id}`}
          id={id}
          proposalName={proposalName}
          dataCollectionGroup={dataCollectionGroup}
          type={type}
          status={status}
        ></WorkflowDescription>,
      ])
      .unzip()
      .value();

    const logsUrl = getMxWorkflowLog({
      workflowId:
        dataCollectionGroup.DataCollectionGroup_workflowId?.toString() || '',
    }).url;
    const fullLogsUrl = `${site.host}${site.apiPrefix}/${token}${logsUrl}`;

    return (
      <Container fluid>
        <Row>
          <Button
            variant={'link'}
            onClick={() => {
              openInNewTab(fullLogsUrl);
            }}
          >
            Workflow logs
          </Button>
        </Row>
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
        <ZoomImage
          alt="Workflow step thumbnail"
          style={{ maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}
          src={getWorkflowImage({ proposalName, stepId: id }).url}
        ></ZoomImage>
      </Col>
    );
  }
  return null;
}

function WorkflowDescription({
  proposalName,
  type,
  status,
  dataCollectionGroup,
  id,
}: {
  proposalName: string;
  type: string | undefined;
  status: string | undefined;
  dataCollectionGroup: DataCollectionGroup;
  id: string | undefined;
}) {
  const [modalShow, setModalShow] = useState(false);

  if (type && status) {
    const url = `/legacy/proposals/${proposalName}/MX/${dataCollectionGroup.BLSession_sessionId}/workflow/${dataCollectionGroup.Workflow_workflowId}/steps/${dataCollectionGroup.WorkflowStep_workflowStepId}?select=${id}`;
    return (
      <>
        <Col style={{ textAlign: 'center', marginBottom: 10 }}>
          <Row>
            <h5>{type}</h5>
          </Row>
          <Row>
            <span>
              <Badge
                style={{ margin: 10, marginTop: 0 }}
                bg={getBadgeColor(status)}
              >
                {status}
              </Badge>
            </span>
          </Row>
          <Button variant="dark" onClick={() => setModalShow(true)}>
            Open
          </Button>
        </Col>
        <WorkflowModal
          proposalName={proposalName}
          step={id}
          type={type}
          url={url}
          show={modalShow}
          onHide={() => setModalShow(false)}
        ></WorkflowModal>
      </>
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
