import { createAuthenticatedResource } from '../Base/Authenticated';
import { SSXDataCollectionProcessingCellsSingletonBase } from 'models/SSXDataCollectionProcessingCells';

export const SSXDataCollectionProcessingStatsResource =
  createAuthenticatedResource({
    path: '/ssx/datacollection/processing/cells/:dummy',
    schema: SSXDataCollectionProcessingCellsSingletonBase,
    endpointOptions: { pollFrequency: 5000 },
  });
