import { withSSXDataCollectionProcessingStats } from 'models/SSXDataCollectionProcessingStats.d';
import { AuthenticatedResource } from '../Base/Authenticated';

class _SSXDataCollectionProcessingStats extends AuthenticatedResource {
  readonly dataCollectionId: number;

  pk() {
    return this.dataCollectionId.toString();
  }

  static getEndpointExtra() {
    return {
      ...super.getEndpointExtra(),
      pollFrequency: 5000,
    };
  }

  static urlRoot = 'ssx/datacollection/processing/stats';
}

export const SSXDataCollectionProcessingStatsResource =
  withSSXDataCollectionProcessingStats(_SSXDataCollectionProcessingStats);
