import { AuthenticatedEndpoint } from 'api/resources/Base/Authenticated';
import { SSXDataCollectionProcessingCellsSingletonBase } from 'models/SSXDataCollectionProcessingCells';

export const SSXDataCollectionProcessingCellsEndpoint =
  new AuthenticatedEndpoint({
    path: '/ssx/datacollection/processing/cells',
    schema: SSXDataCollectionProcessingCellsSingletonBase,
    pollFrequency: 5000,
  });
