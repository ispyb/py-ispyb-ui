import PaginatedResource from 'api/resources/Base/Paginated';
import { withAutoProcProgram } from 'models/AutoProcProgram.d';

export class _AutoProcProgramResource extends PaginatedResource {
  readonly autoProcProgramId: number;

  pk() {
    return this.autoProcProgramId?.toString();
  }
  static urlRoot = 'processings';
}

export const AutoProcProgramResource = withAutoProcProgram(
  _AutoProcProgramResource
);
