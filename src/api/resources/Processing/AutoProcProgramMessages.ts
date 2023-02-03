import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from '../Base/Paginated';
import { withAutoProcProgramMessage } from 'models/AutoProcProgramMessage';

export class AutoProcProgramMessageEntity extends Entity {
  readonly autoProcProgramId: number;

  pk() {
    return this.autoProcProgramId?.toString();
  }
}

export const AutoProcProgramMessageResource = createPaginatedResource({
  path: '/processings/messages/:autoProcProgramMessageId',
  schema: withAutoProcProgramMessage(AutoProcProgramMessageEntity),
});
