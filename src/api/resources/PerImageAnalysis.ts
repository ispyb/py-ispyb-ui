import { Entity } from '@rest-hooks/rest';
import createPaginatedResource from './Base/Paginated';
import { withPerImageAnalysis } from 'models/PerImageAnalysis';

class PerImageAnalysisEntity extends Entity {
  readonly dataCollectionId: number;

  pk() {
    return this.dataCollectionId?.toString();
  }
}

export const PerImageAnalysisResource = createPaginatedResource({
  path: '/datacollections/quality/:dataCollectionId',
  schema: withPerImageAnalysis(PerImageAnalysisEntity),
  endpointOptions: { pollFrequency: 5000 },
});
