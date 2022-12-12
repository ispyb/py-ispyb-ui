import PaginatedResource from 'api/resources/Base/Paginated';

// https://github.com/rjsf-team/react-jsonschema-form/issues/2006
// https://levelup.gitconnected.com/using-crud-operations-with-react-swr-for-mutating-rest-api-cache-3e0d01774aed

export class LabContactResource extends PaginatedResource {
  readonly labContactId: number | undefined = undefined;

  pk() {
    return this.labContactId?.toString();
  }
  static urlRoot = 'labcontacts';
}
