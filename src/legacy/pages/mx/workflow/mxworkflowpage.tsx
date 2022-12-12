import { useMxWorkflow } from 'legacy/hooks/ispyb';
import useQueryParams from 'legacy/hooks/usequeyparams';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import WorkflowContent from './workflowcontent';
import WorkflowThumbnail from './workflowthumbnail';

type Param = {
  sessionId: string;
  proposalName: string;
  workflowId: string;
  stepsIds: string;
};

export default function MXWorkflowPage() {
  const { proposalName = '', stepsIds = '' } = useParams<Param>();
  const { select } = useQueryParams();

  const steps = stepsIds.split(',');

  return (
    <Tab.Container defaultActiveKey={select}>
      <Row style={{ padding: 5, borderBottom: '1px solid gray' }}>
        <Nav variant="pills">
          {steps.map((stepId) => {
            return (
              <MXWorkflowStep proposalName={proposalName} stepId={stepId} />
            );
          })}
        </Nav>
      </Row>
      <Row>
        <Tab.Content>
          {steps.map((stepId) => {
            return (
              <MXWorkflowStepContent
                proposalName={proposalName}
                stepId={stepId}
              />
            );
          })}
          <Tab.Pane eventKey="first"></Tab.Pane>
          <Tab.Pane eventKey="second"></Tab.Pane>
        </Tab.Content>
      </Row>
    </Tab.Container>
  );
}

function MXWorkflowStep({
  proposalName,
  stepId,
}: {
  proposalName: string;
  stepId: string;
}) {
  const { data } = useMxWorkflow({ proposalName, stepId });

  if (!data) return null;
  return (
    <Col style={{ height: '100%', maxWidth: 300 }}>
      <Nav.Item style={{ height: '100%' }}>
        <Nav.Link style={{ height: '100%' }} eventKey={stepId}>
          <WorkflowThumbnail
            proposalName={proposalName}
            stepId={stepId}
            step={data}
          ></WorkflowThumbnail>
        </Nav.Link>
      </Nav.Item>
    </Col>
  );
}

function MXWorkflowStepContent({
  proposalName,
  stepId,
}: {
  proposalName: string;
  stepId: string;
}) {
  const { data } = useMxWorkflow({ proposalName, stepId });
  if (!data) return null;
  return (
    <Tab.Pane eventKey={stepId}>
      <WorkflowContent step={data}></WorkflowContent>
    </Tab.Pane>
  );
}
