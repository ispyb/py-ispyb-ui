import { createAuthenticatedResource } from '../Base/Authenticated';
import { SSXDataCollectionProcessingStatsBase } from 'models/SSXDataCollectionProcessingStats';

class SSXDataCollectionProcessingStatsEntity extends SSXDataCollectionProcessingStatsBase {
  readonly dataCollectionId: number;

  pk() {
    return this.dataCollectionId.toString();
  }
}

export const SSXDataCollectionProcessingStatsResource =
  createAuthenticatedResource({
    path: '/ssx/datacollection/processing/stats/:dataCollectionId',
    schema: SSXDataCollectionProcessingStatsEntity,
    endpointOptions: { pollFrequency: 5000 },
  });
