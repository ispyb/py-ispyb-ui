import PaginatedResource from 'api/resources/Base/Paginated';
import { withAutoProcProgramIntegration } from 'models/AutoProcProgramIntegration.d';

export class _AutoProcProgramIntegrationResource extends PaginatedResource {
  readonly autoProcProgramId: number;

  pk() {
    return this.autoProcProgramId?.toString();
  }
  static urlRoot = 'processings/auto-integrations';
}

export const AutoProcProgramIntegrationResource =
  withAutoProcProgramIntegration(_AutoProcProgramIntegrationResource);
