import { getWorkflowImage } from 'legacy/api/ispyb';
import ZoomImage, { ZoomImageIcat } from 'legacy/components/image/zoomimage';
import _ from 'lodash';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import { useState } from 'react';
import { Col, Row, Button, Badge, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import WorkflowModal from './workflowmodal';
import { Dataset } from 'legacy/hooks/icatmodel';
import { useSubDatasets } from 'legacy/hooks/icat';

export default function WorkflowDataCollectionGroupPanel({
  dataCollectionGroup,
  proposalName,
}: {
  dataCollectionGroup: Dataset;
  proposalName: string;
}) {
  const { data: workflows } = useSubDatasets({
    dataset: dataCollectionGroup,
    type: 'workflow',
  });

  if (workflows.length) {
    const [thumbnails, descriptions] = _(workflows)
      .map((workflow) => [
        <WorkflowThumbnail
          dataset={workflow}
          key={`thumbnail${workflow.id}`}
        ></WorkflowThumbnail>,
        <WorkflowDescription
          key={`description${workflow.id}`}
          proposalName={proposalName}
          dataset={workflow}
        ></WorkflowDescription>,
      ])
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
function WorkflowThumbnail({ dataset }: { dataset?: Dataset }) {
  if (dataset) {
    return (
      <Col style={{ textAlign: 'center', margin: 'auto' }}>
        <ZoomImageIcat
          style={{ maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}
          dataset={dataset}
          index={0}
        />
        {/* <ZoomImage
          style={{ maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}
          src={getWorkflowImage({ proposalName, stepId: id }).url}
        ></ZoomImage> */}
      </Col>
    );
  }
  return null;
}

function WorkflowDescription({
  proposalName,
  dataset,
}: {
  proposalName: string;
  dataset: Dataset;
}) {
  const [modalShow, setModalShow] = useState(false);

  // if (type && status) {
  //   const url = `/legacy/proposals/${proposalName}/MX/${dataCollectionGroup.BLSession_sessionId}/workflow/${dataCollectionGroup.Workflow_workflowId}/steps/${dataCollectionGroup.WorkflowStep_workflowStepId}?select=${id}`;
  //   return (
  //     <>
  //       <Col style={{ textAlign: 'center', marginBottom: 10 }}>
  //         <Row>
  //           <h5>{type}</h5>
  //         </Row>
  //         <Row>
  //           <span>
  //             <Badge
  //               style={{ margin: 10, marginTop: 0 }}
  //               bg={getBadgeColor(status)}
  //             >
  //               {status}
  //             </Badge>
  //           </span>
  //         </Row>
  //         <Button
  //           variant="dark"
  //           disabled={true}
  //           onClick={() => setModalShow(true)}
  //         >
  //           Open
  //         </Button>
  //       </Col>
  //       {/* <WorkflowModal
  //         proposalName={proposalName}
  //         step={id}
  //         type={type}
  //         url={url}
  //         show={modalShow}
  //         onHide={() => setModalShow(false)}
  //       ></WorkflowModal> */}
  //     </>
  //   );
  // }
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
