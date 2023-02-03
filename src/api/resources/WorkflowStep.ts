import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from './Base/Paginated';
import { withWorkflowStep } from 'models/WorkflowStep';

export class WorkflowStepEntity extends Entity {
  readonly workflowStepId: number;

  pk() {
    return this.workflowStepId.toString();
  }
}

export const WorkflowStepResource = createPaginatedResource({
  path: '/datacollections/workflows/steps/:workflowStepId',
  schema: withWorkflowStep(WorkflowStepEntity),
});
