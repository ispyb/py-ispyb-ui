import PaginatedResource from './Base/Paginated';
import { withWorkflowStep } from 'models/WorkflowStep.d';

export class _WorkflowStepResource extends PaginatedResource {
  readonly workflowStepId: number;

  pk() {
    return this.workflowStepId.toString();
  }
  static urlRoot = 'datacollections/workflows/steps';
}

export const WorkflowStepResource = withWorkflowStep(_WorkflowStepResource);
