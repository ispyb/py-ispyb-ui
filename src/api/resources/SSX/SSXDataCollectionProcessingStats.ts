import { Entity } from '@rest-hooks/endpoint';

import { createAuthenticatedResource } from '../Base/Authenticated';
import { withSSXDataCollectionProcessingStats } from 'models/SSXDataCollectionProcessingStats';

class SSXDataCollectionProcessingStatsEntity extends Entity {
  readonly dataCollectionId: number;

  pk() {
    return this.dataCollectionId.toString();
  }
}

export const SSXDataCollectionProcessingStatsResource =
  createAuthenticatedResource({
    path: '/ssx/datacollection/processing/stats/:dataCollectionId',
    schema: withSSXDataCollectionProcessingStats(
      SSXDataCollectionProcessingStatsEntity
    ),
    endpointOptions: { pollFrequency: 5000 },
  });
