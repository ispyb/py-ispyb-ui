import { createAuthenticatedSingletonResource } from '../Base/Singleton';
import { SSXDataCollectionProcessingCellsHistogramBase } from 'models/SSXDataCollectionProcessingCellsHistogram';

class SSXDataCollectionProcessingCellsHistogramEntity extends SSXDataCollectionProcessingCellsHistogramBase {
  pk() {
    if (this.dataCollectionIds.sort)
      return this.dataCollectionIds.sort().join(',');
    return undefined;
  }
}

export const SSXDataCollectionProcessingCellsHistogramResource =
  createAuthenticatedSingletonResource({
    path: '/ssx/datacollection/processing/cells/histogram/:dummy',
    schema: SSXDataCollectionProcessingCellsHistogramEntity,
    endpointOptions: { pollFrequency: 5000 },
  });
