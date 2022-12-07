import { AuthenticatedSingletonResource } from '../Base/Singleton';
import { withBreakdown } from 'models/Breakdown.d';

class _BreakdownResource extends AuthenticatedSingletonResource {
  static urlRoot = 'stats/breakdown';
}

export const BreakdownResource = withBreakdown(_BreakdownResource);
