import { store } from 'store';
import { Site } from 'models';

let server = '';
let token = '';
/** This method listen the changes on the store of the server */
store.subscribe(() => {
  server = store.getState().site.server;
  token = store.getState().user.token;
});

export function getLogin(site: Site) {
  return `${server}/authenticate?site=${site}`;
}

export function getSessions({ startDate, endDate }: { startDate?: string; endDate?: string }) {
  if (startDate && endDate) {
    return { url: `${server}/${token}/proposal/session/date/${startDate}/${endDate}/list` };
  }

  return { url: `${server}/${token}/session/list` };
}

export function getProposal(proposalName?: string) {
  return { url: `${server}/${token}/proposal/${proposalName}/info/get` };
}

export function getSessionById(sessionId: string | undefined) {
  return { url: `${server}/${token}/proposal/session/${sessionId}/list` };
}

export function getDataCollectionsBy({ proposalName, sessionId }: { proposalName: string; sessionId?: string }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/datacollection/session/${sessionId}/list` };
}

export function getCrystalImage({ proposalName, dataCollectionId, imageIndex }: { proposalName: string; dataCollectionId: number; imageIndex: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/mx/datacollection/${dataCollectionId}/crystalsnaphot/${imageIndex}/get` };
}

export function getEMStatisticsBy({ proposalName, sessionId }: { proposalName: string; sessionId?: string }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/session/${sessionId}/stats` };
}

export function getEmMoviesByDataCollectionId({ dataCollectionId, proposalName }: { proposalName: string; dataCollectionId: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/datacollection/${dataCollectionId}/movie/all` };
}
export function getCTFThumbnail({ dataCollectionId, movieId, proposalName }: { proposalName: string; dataCollectionId: number; movieId: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/datacollection/${dataCollectionId}/movie/${movieId}/thumbnail` };
}

export function getMotionCorrectionDrift({ proposalName, dataCollectionId, movieId }: { proposalName: string; dataCollectionId: number; movieId: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/datacollection/${dataCollectionId}/movie/${movieId}/motioncorrection/drift` };
}

export function getMotionCorrectionThumbnail({ proposalName, dataCollectionId, movieId }: { proposalName: string; dataCollectionId: number; movieId: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/datacollection/${dataCollectionId}/movie/${movieId}/motioncorrection/thumbnail` };
}
export function getMovieThumbnail({ proposalName, dataCollectionId, movieId }: { proposalName: string; dataCollectionId: number; movieId: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/datacollection/${dataCollectionId}/movie/${movieId}/thumbnail` };
}
