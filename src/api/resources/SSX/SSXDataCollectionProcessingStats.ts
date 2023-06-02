import { AuthenticatedEndpoint } from '../Base/Authenticated';
import { SSXDataCollectionProcessingStatsBase } from 'models/SSXDataCollectionProcessingStats';

class SSXDataCollectionProcessingStatsEntity extends SSXDataCollectionProcessingStatsBase {
  readonly key: string;

  pk() {
    return this.key;
  }
}

export const SSXDataCollectionProcessingStatsEndpoint =
  new AuthenticatedEndpoint({
    path: '/ssx/datacollection/processing/stats',
    schema: [SSXDataCollectionProcessingStatsEntity],
    process(value, params) {
      const res = value.map((v: any) => {
        v.key = `dataCollectionIds:${params.dataCollectionIds
          .split(',')
          .sort()
          .join(',')}`;
        return v;
      });
      return res;
    },
    searchParams: {} as {
      dataCollectionIds: string;
    },
    endpointOptions: { pollFrequency: 5000 },
  });
