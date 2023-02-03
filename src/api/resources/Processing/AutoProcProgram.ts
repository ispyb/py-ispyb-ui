import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from '../Base/Paginated';
import { withAutoProcProgram } from 'models/AutoProcProgram';

export class AutoProcProgramEntity extends Entity {
  readonly autoProcProgramId: number;

  pk() {
    return this.autoProcProgramId?.toString();
  }
}

export const AutoProcProgramResource = createPaginatedResource({
  path: '/processings/:autoProcProgramId',
  schema: withAutoProcProgram(AutoProcProgramEntity),
});
