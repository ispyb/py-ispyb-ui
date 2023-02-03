import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from '../Base/Paginated';
import { withAutoProcProgramIntegration } from 'models/AutoProcProgramIntegration';

export class AutoProcProgramIntegrationEntity extends Entity {
  readonly autoProcProgramId: number;

  pk() {
    return this.autoProcProgramId?.toString();
  }
}

export const AutoProcProgramIntegrationResource = createPaginatedResource({
  path: '/processings/auto-integrations/:autoProcProgramIntegrationId',
  schema: withAutoProcProgramIntegration(AutoProcProgramIntegrationEntity),
});
