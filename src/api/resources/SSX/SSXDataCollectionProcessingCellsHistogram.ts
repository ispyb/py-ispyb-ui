import { Entity } from '@rest-hooks/endpoint';
import { createAuthenticatedSingletonResource } from '../Base/Singleton';
import { withSSXDataCollectionProcessingCellsHistogram } from 'models/SSXDataCollectionProcessingCellsHistogram';

class SSXDataCollectionProcessingCellsHistogramEntity extends Entity {
  readonly dataCollectionIds: number[];
  pk() {
    return this.dataCollectionIds.sort().join(',');
  }
}

export const SSXDataCollectionProcessingCellsHistogramResource =
  createAuthenticatedSingletonResource({
    path: '/ssx/datacollection/processing/cells/histogram/:dummy',
    schema: withSSXDataCollectionProcessingCellsHistogram(
      SSXDataCollectionProcessingCellsHistogramEntity
    ),
    endpointOptions: { pollFrequency: 5000 },
  });
