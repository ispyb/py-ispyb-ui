import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from './Base/Paginated';

// https://github.com/rjsf-team/react-jsonschema-form/issues/2006
// https://levelup.gitconnected.com/using-crud-operations-with-react-swr-for-mutating-rest-api-cache-3e0d01774aed

export class LabContactEntity extends Entity {
  readonly labContactId: number | undefined = undefined;

  pk() {
    return this.labContactId?.toString();
  }
}

export const LabContactResource = createPaginatedResource({
  path: '/labcontacts/:labContactId',
  schema: LabContactEntity,
});
