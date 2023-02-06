import createPaginatedResource from '../Base/Paginated';
import { AutoProcProgramAttachmentBase } from 'models/AutoProcProgramAttachment';

export class AutoProcProgramAttachmentEntity extends AutoProcProgramAttachmentBase {
  readonly autoProcProgramAttachmentId: number;

  pk() {
    return this.autoProcProgramAttachmentId?.toString();
  }
}

export const AutoProcProgramAttachmentResource = createPaginatedResource({
  path: '/processings/attachments/:autoProcProgramAttachmentId',
  schema: AutoProcProgramAttachmentEntity,
});
