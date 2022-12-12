import PaginatedResource from './Base/Paginated';
import { withPerImageAnalysis } from 'models/PerImageAnalysis.d';

class _PerImageAnalysisResource extends PaginatedResource {
  readonly dataCollectionId: number;

  pk() {
    return this.dataCollectionId?.toString();
  }
  static getEndpointExtra() {
    return {
      ...super.getEndpointExtra(),
      pollFrequency: 5000,
    };
  }
  static urlRoot = 'datacollections/quality';
}

export const PerImageAnalysisResource = withPerImageAnalysis(
  _PerImageAnalysisResource
);
