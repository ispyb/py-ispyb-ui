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

export function getSSXDataCollection({ ssxDatacollectionId }: { ssxDatacollectionId: number }): RequestInformation {
  return { url: `${server_py}/ssx/datacollection/${ssxDatacollectionId}`, token };
}

export function getSSXDataCollectionSample({ ssxDatacollectionId }: { ssxDatacollectionId: number }): RequestInformation {
  return { url: `${server_py}/ssx/datacollection/${ssxDatacollectionId}/sample`, token };
}
export function getDataCollectionSampleThumbnail({ dataCollectionId, thumbnailNumber }: { dataCollectionId: number; thumbnailNumber: number }): RequestInformation {
  return { url: `${server_py}/events/image/${dataCollectionId}?imageId=${thumbnailNumber}&fullSize=true`, token };
}

export function getSession({ sessionId }: { sessionId: string }): RequestInformation {
  return { url: `${server_py}/session/${sessionId}`, token };
}
