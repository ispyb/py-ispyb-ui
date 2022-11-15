import { store } from 'store';

let server_py: string | undefined;
let token = '';
/** This method listen the changes on the store of the server */
store.subscribe(() => {
  server_py = store.getState().site.server_py;
  token = store.getState().user.token;
});

export type RequestInformation = {
  url: string;
  token: string;
};

export function getSSXDataCollections({ sessionId, dataCollectionGroupId }: { sessionId: string; dataCollectionGroupId: string }): RequestInformation {
  return { url: `${server_py}/ssx/datacollection?sessionId=${sessionId}&dataCollectionGroupId=${dataCollectionGroupId}`, token };
}

export function getSSXDataCollectionGroups({ sessionId }: { sessionId: string }): RequestInformation {
  return { url: `${server_py}/ssx/datacollectiongroup?sessionId=${sessionId}`, token };
}

export function getSSXDataCollectionGroup({ dataCollectionGroupId }: { dataCollectionGroupId: string }): RequestInformation {
  return { url: `${server_py}/ssx/datacollectiongroup/${dataCollectionGroupId}`, token };
}

export function getSSXDataCollection({ datacollectionId }: { datacollectionId: number }): RequestInformation {
  return { url: `${server_py}/ssx/datacollection/${datacollectionId}`, token };
}

export function getSSXDataCollectionSample({ datacollectionId }: { datacollectionId: number }): RequestInformation {
  return { url: `${server_py}/ssx/datacollection/${datacollectionId}/sample`, token };
}

export function getSSXDataCollectionGroupSample({ datacollectiongroupId }: { datacollectiongroupId: number }): RequestInformation {
  return { url: `${server_py}/ssx/datacollectiongroup/${datacollectiongroupId}/sample`, token };
}

export function getDataCollectionGraphs({ datacollectionId }: { datacollectionId: number }): RequestInformation {
  return { url: `${server_py}/ssx/datacollection/${datacollectionId}/graphs`, token };
}

export function getSSXDataCollectionHits({ datacollectionId }: { datacollectionId: number }): RequestInformation {
  return { url: `${server_py}/ssx/datacollection/${datacollectionId}/hits`, token };
}

export function getDataCollectionGraphData({ graphId }: { graphId: number }): RequestInformation {
  return { url: `${server_py}/ssx/graph/${graphId}/data`, token };
}

export function getSSXDataCollectionSequences({ datacollectionId }: { datacollectionId: number }): RequestInformation {
  return { url: `${server_py}/ssx/datacollection/${datacollectionId}/sequences`, token };
}

export function getDataCollectionSampleThumbnail({ dataCollectionId, thumbnailNumber }: { dataCollectionId: number; thumbnailNumber: number }): RequestInformation {
  return { url: `${server_py}/events/image/${dataCollectionId}?imageId=${thumbnailNumber}&fullSize=true`, token };
}

export function getSession({ sessionId }: { sessionId: string }): RequestInformation {
  return { url: `${server_py}/session/${sessionId}`, token };
}

export function getEventsSession({ sessionId, proposal }: { sessionId: number; proposal: string }): RequestInformation {
  return { url: `${server_py}/events?limit=9999&sessionId=${sessionId}&proposal=${proposal}`, token };
}

export function getEventsDataCollectionGroup({ dataCollectionGroupId }: { dataCollectionGroupId: number }): RequestInformation {
  return { url: `${server_py}/events?limit=9999&dataCollectionGroupId=${dataCollectionGroupId}`, token };
}

export function getSample({ blSampleId }: { blSampleId: number }): RequestInformation {
  return { url: `${server_py}/samples/${blSampleId}`, token };
}

export function getSSXDataCollectionProcessingStats({ datacollectionIds }: { datacollectionIds: number[] }): RequestInformation {
  return { url: `${server_py}/ssx/datacollection/processing/stats?dataCollectionIds=${datacollectionIds.join(',')}`, token };
}

export function getSSXDataCollectionProcessingCells({ datacollectionId }: { datacollectionId: number }): RequestInformation {
  return { url: `${server_py}/ssx/datacollection/processing/cells?dataCollectionId=${datacollectionId}`, token };
}
export function getSSXDataCollectionProcessingCellsHistogram({ datacollectionId }: { datacollectionId: number }): RequestInformation {
  return { url: `${server_py}/ssx/datacollection/processing/cells/histogram?dataCollectionId=${datacollectionId}`, token };
}

export function getEventChains({ datacollectionId }: { datacollectionId: number }): RequestInformation {
  return { url: `${server_py}/eventchain?dataCollectionId=${datacollectionId}`, token };
}