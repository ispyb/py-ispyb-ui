import { withSSXDataCollectionProcessingCells } from 'models/SSXDataCollectionProcessingCells.d';
import { AuthenticatedResource } from '../Base/Authenticated';

class _SSXDataCollectionProcessingCells extends AuthenticatedResource {
  pk() {
    return '1';
  }

  static getEndpointExtra() {
    return {
      ...super.getEndpointExtra(),
      pollFrequency: 5000,
    };
  }

  static urlRoot = 'ssx/datacollection/processing/cells';
}

export const SSXDataCollectionProcessingStatsResource =
  withSSXDataCollectionProcessingCells(_SSXDataCollectionProcessingCells);
