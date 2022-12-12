import PaginatedResource from '../Base/Paginated';
import { withAutoProcProgramAttachment } from 'models/AutoProcProgramAttachment.d';

export class _AutoProcProgramAttachmentResource extends PaginatedResource {
  readonly autoProcProgramAttachmentId: number;

  pk() {
    return this.autoProcProgramAttachmentId.toString();
  }
  static urlRoot = 'processings/attachments';
}

export const AutoProcProgramAttachmentResource = withAutoProcProgramAttachment(
  _AutoProcProgramAttachmentResource
);
