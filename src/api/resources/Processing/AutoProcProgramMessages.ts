import PaginatedResource from '../Base/Paginated';
import { withAutoProcProgramMessage } from 'models/AutoProcProgramMessage.d';

export class _AutoProcProgramMessageResource extends PaginatedResource {
  readonly autoProcProgramMessageId: number;

  pk() {
    return this.autoProcProgramMessageId.toString();
  }
  static urlRoot = 'processings/attachments';
}

export const AutoProcProgramMessageResource = withAutoProcProgramMessage(
  _AutoProcProgramMessageResource
);
