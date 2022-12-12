import { withSSXDataCollectionProcessingCellsHistogram } from 'models/SSXDataCollectionProcessingCellsHistogram.d';
import { AuthenticatedSingletonResource } from '../Base/Singleton';

class _SSXDataCollectionProcessingCellsHistogram extends AuthenticatedSingletonResource {
  readonly dataCollectionIds: number[];
  pk() {
    return this.dataCollectionIds.sort().join(',');
  }

  static getEndpointExtra() {
    return {
      ...super.getEndpointExtra(),
      pollFrequency: 5000,
    };
  }

  static urlRoot = 'ssx/datacollection/processing/cells/histogram';
}

export const SSXDataCollectionProcessingCellsHistogramResource =
  withSSXDataCollectionProcessingCellsHistogram(
    _SSXDataCollectionProcessingCellsHistogram
  );
