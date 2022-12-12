import PaginatedResource from './Base/Paginated';
import { withDataCollectionFileAttachment } from 'models/DataCollectionFileAttachment.d';

export class _DataCollectionFileAttachmentResource extends PaginatedResource {
  readonly dataCollectionFileAttachmentId: number;

  pk() {
    return this.dataCollectionFileAttachmentId.toString();
  }
  static urlRoot = 'datacollections/attachments';
}

export const DataCollectionFileAttachmentResource =
  withDataCollectionFileAttachment(_DataCollectionFileAttachmentResource);
