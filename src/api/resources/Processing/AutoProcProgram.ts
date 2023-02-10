import createPaginatedResource from '../Base/Paginated';
import { AutoProcProgramBase } from 'models/AutoProcProgram';

export class AutoProcProgramEntity extends AutoProcProgramBase {
  readonly autoProcProgramId: number;

  pk() {
    return this.autoProcProgramId?.toString();
  }
}

export const AutoProcProgramResource = createPaginatedResource({
  path: '/processings/:autoProcProgramId',
  schema: AutoProcProgramEntity,
});
