import createPaginatedResource from './Base/Paginated';
import { DataCollectionFileAttachmentBase } from 'models/DataCollectionFileAttachment';

export class DataCollectionFileAttachmentEntity extends DataCollectionFileAttachmentBase {
  readonly dataCollectionFileAttachmentId: number;

  pk() {
    return this.dataCollectionFileAttachmentId.toString();
  }
}

export const DataCollectionFileAttachmentResource = createPaginatedResource({
  path: '/datacollections/attachments/:dataCollectionFileAttachmentId',
  schema: DataCollectionFileAttachmentEntity,
});
