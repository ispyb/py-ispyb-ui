import { createAuthenticatedSingletonResource } from '../Base/Singleton';
import { SSXDataCollectionProcessingCellsHistogramBase } from 'models/SSXDataCollectionProcessingCellsHistogram';

class SSXDataCollectionProcessingCellsHistogramEntity extends SSXDataCollectionProcessingCellsHistogramBase {
  readonly dataCollectionIds: number[];
  pk() {
    return this.dataCollectionIds.sort().join(',');
  }
}

export const SSXDataCollectionProcessingCellsHistogramResource =
  createAuthenticatedSingletonResource({
    path: '/ssx/datacollection/processing/cells/histogram/:dummy',
    schema: SSXDataCollectionProcessingCellsHistogramEntity,
    endpointOptions: { pollFrequency: 5000 },
  });
