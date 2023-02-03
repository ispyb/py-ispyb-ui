import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from './Base/Paginated';
import { withDataCollectionFileAttachment } from 'models/DataCollectionFileAttachment';

export class DataCollectionFileAttachmentEntity extends Entity {
  readonly dataCollectionFileAttachmentId: number;

  pk() {
    return this.dataCollectionFileAttachmentId.toString();
  }
}

export const DataCollectionFileAttachmentResource = createPaginatedResource({
  path: '/datacollections/attachments/:dataCollectionFileAttachmentId',
  schema: withDataCollectionFileAttachment(DataCollectionFileAttachmentEntity),
});
