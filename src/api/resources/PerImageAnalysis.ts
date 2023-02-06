import createPaginatedResource from './Base/Paginated';
import { PerImageAnalysisBase } from 'models/PerImageAnalysis';

class PerImageAnalysisEntity extends PerImageAnalysisBase {
  readonly dataCollectionId: number;

  pk() {
    return this.dataCollectionId?.toString();
  }
}

export const PerImageAnalysisResource = createPaginatedResource({
  path: '/datacollections/quality/:dataCollectionId',
  schema: PerImageAnalysisEntity,
  endpointOptions: { pollFrequency: 5000 },
});
