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

export function getSessions(startDate?: string, endDate?: string) {
  return { url: `${server}/${token}/proposal/session/date/${startDate}/${endDate}/list` };
}

export function getSessionById(sessionId: string) {
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
