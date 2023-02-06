import createPaginatedResource from '../Base/Paginated';
import { AutoProcProgramIntegrationBase } from 'models/AutoProcProgramIntegration';

export class AutoProcProgramIntegrationEntity extends AutoProcProgramIntegrationBase {
  readonly autoProcProgramId: number;

  pk() {
    return this.autoProcProgramId?.toString();
  }
}

export const AutoProcProgramIntegrationResource = createPaginatedResource({
  path: '/processings/auto-integrations/:autoProcProgramIntegrationId',
  schema: AutoProcProgramIntegrationEntity,
});
