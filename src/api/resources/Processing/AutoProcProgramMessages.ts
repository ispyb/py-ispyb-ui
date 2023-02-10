import createPaginatedResource from '../Base/Paginated';
import { AutoProcProgramMessageBase } from 'models/AutoProcProgramMessage';

export class AutoProcProgramMessageEntity extends AutoProcProgramMessageBase {
  readonly autoProcProgramId: number;

  pk() {
    return this.autoProcProgramId?.toString();
  }
}

export const AutoProcProgramMessageResource = createPaginatedResource({
  path: '/processings/messages/:autoProcProgramMessageId',
  schema: AutoProcProgramMessageEntity,
});
