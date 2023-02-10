import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { SSXDataCollectionProcessingCellsHistogramBase } from 'models/SSXDataCollectionProcessingCellsHistogram';

class SSXDataCollectionProcessingCellsHistogramEntity extends SSXDataCollectionProcessingCellsHistogramBase {
  pk() {
    if (this.dataCollectionIds.sort)
      return this.dataCollectionIds.sort().join(',');
    return undefined;
  }
}

export const SSXDataCollectionProcessingCellsHistogramEndpoint =
  new AuthenticatedEndpoint({
    path: '/ssx/datacollection/processing/cells/histogram',
    schema: SSXDataCollectionProcessingCellsHistogramEntity,
    searchParams: {} as {
      dataCollectionIds: string;
    },
    pollFrequency: 5000,
  });
