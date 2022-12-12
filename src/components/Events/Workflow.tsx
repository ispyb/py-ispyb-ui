import { Suspense, useState } from 'react';
import { useSuspense } from 'rest-hooks';
import { Card, CardGroup } from 'react-bootstrap';

import { WorkflowStepResource } from 'api/resources/WorkflowStep';
import { LazyImage } from 'api/resources/XHRFile';
import { Workflow } from 'models/Event.d';
import Loading from 'components/Loading';

interface IWorkflowSteps {
  workflowId: number;
}

function WorkflowStepsMain({ workflowId }: IWorkflowSteps) {
  const steps = useSuspense(WorkflowStepResource.list(), {
    workflowId,
  });
  return (
    <CardGroup>
      {steps.results.map((step) => (
        <Card key={step.workflowStepId}>
          {step._metadata.attachments.imageResultFilePath && (
            <LazyImage
              className="card-img-top"
              src={`/datacollections/workflows/steps/${step.workflowStepId}?attachmentType=imageResultFilePath`}
              alt={`${step.workflowStepType} Image`}
            />
          )}
          <Card.Header>{step.workflowStepType}</Card.Header>
          <Card.Body>{step.status}</Card.Body>
        </Card>
      ))}
    </CardGroup>
  );
}

function WorkflowSteps(props: IWorkflowSteps) {
  return (
    <div className="workflow-results border-top p-2">
      <Suspense fallback={<Loading />}>
        <WorkflowStepsMain {...props} />
      </Suspense>
    </div>
  );
}

export default function WorkflowView(props: Workflow) {
  const [showWorkflow, setShowWorkflow] = useState<boolean>(false);
  return (
    <div className="workflow mt-1 border rounded bg-light">
      <div
        className="d-flex justify-content-between p-2"
        style={{ cursor: 'pointer' }}
        onClick={() => setShowWorkflow(!showWorkflow)}
      >
        <div>Workflow: {props.workflowType}</div>
        <div>{props.status}</div>
      </div>

      {showWorkflow && <WorkflowSteps workflowId={props.workflowId} />}
    </div>
  );
}
