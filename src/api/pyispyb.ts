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

export function getSSXDataCollections({ sessionId }: { sessionId: string }): RequestInformation {
  return { url: `${server_py}/ssx/datacollection?sessionId=${sessionId}`, token };
}

export function getSSXDataCollection({ datacollectionId }: { datacollectionId: number }): RequestInformation {
  return { url: `${server_py}/ssx/datacollection/${datacollectionId}`, token };
}

export function getSSXDataCollectionSample({ datacollectionId }: { datacollectionId: number }): RequestInformation {
  return { url: `${server_py}/ssx/datacollection/${datacollectionId}/sample`, token };
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
