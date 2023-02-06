import createPaginatedResource from './Base/Paginated';
import { WorkflowStepBase } from 'models/WorkflowStep';

export class WorkflowStepEntity extends WorkflowStepBase {
  readonly workflowStepId: number;

  pk() {
    return this.workflowStepId.toString();
  }
}

export const WorkflowStepResource = createPaginatedResource({
  path: '/datacollections/workflows/steps/:workflowStepId',
  schema: WorkflowStepEntity,
});
