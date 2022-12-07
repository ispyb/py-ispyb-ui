import PaginatedResource from 'api/resources/Base/Paginated';
import { withProtein } from 'models/Protein.d';

export class _ProteinResource extends PaginatedResource {
  readonly proteinId: number;

  pk() {
    return this.proteinId?.toString();
  }
  static urlRoot = 'proteins';
}

export const ProteinResource = withProtein(_ProteinResource);
