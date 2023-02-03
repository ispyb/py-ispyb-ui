import { SingletonEntity } from '../Base/Singleton';
import { createAuthenticatedResource } from '../Base/Authenticated';
import { withSSXDataCollectionProcessingCells } from 'models/SSXDataCollectionProcessingCells';

export const SSXDataCollectionProcessingStatsResource =
  createAuthenticatedResource({
    path: '/ssx/datacollection/processing/cells/:dummy',
    schema: withSSXDataCollectionProcessingCells(SingletonEntity),
    endpointOptions: { pollFrequency: 5000 },
  });
