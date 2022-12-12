import { AuthenticatedSingletonResource } from '../Base/Singleton';
import { withHourlies } from 'models/Hourlies.d';

class _HourliesResource extends AuthenticatedSingletonResource {
  static urlRoot = 'stats/hourlies';
}

export const HourliesResource = withHourlies(_HourliesResource);
