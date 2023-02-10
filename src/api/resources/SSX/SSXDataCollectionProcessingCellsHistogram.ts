import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { SSXDataCollectionProcessingCellsHistogramBase } from 'models/SSXDataCollectionProcessingCellsHistogram';

class SSXDataCollectionProcessingCellsHistogramEntity extends SSXDataCollectionProcessingCellsHistogramBase {
  readonly key: string;

  pk() {
    return this.key;
  }
}

export const SSXDataCollectionProcessingCellsHistogramEndpoint =
  new AuthenticatedEndpoint({
    path: '/ssx/datacollection/processing/cells/histogram',
    schema: SSXDataCollectionProcessingCellsHistogramEntity,
    process(value, params) {
      value.key = `dataCollectionIds:${params.dataCollectionIds
        .split(',')
        .sort()
        .join(',')}`;
      return value;
    },
    searchParams: {} as {
      dataCollectionIds: string;
    },
    pollFrequency: 5000,
  });
