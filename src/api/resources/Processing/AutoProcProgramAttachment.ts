import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from '../Base/Paginated';
import { withAutoProcProgramAttachment } from 'models/AutoProcProgramAttachment';

export class AutoProcProgramAttachmentEntity extends Entity {
  readonly autoProcProgramAttachmentId: number;

  pk() {
    return this.autoProcProgramAttachmentId?.toString();
  }
}

export const AutoProcProgramAttachmentResource = createPaginatedResource({
  path: '/processings/attachments/:autoProcProgramAttachmentId',
  schema: withAutoProcProgramAttachment(AutoProcProgramAttachmentEntity),
});
