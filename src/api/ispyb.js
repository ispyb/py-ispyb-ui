import { store } from '../store';

let server = null;
let token = null;
/** This method listen the changes on the store of the server */
store.subscribe(() => {
  server = store.getState().site.server;
  token = store.getState().user.token;
});

export function getLogin(site) {
  return `${server}/authenticate?site=${site}`;
}

export function getSessions(startDate, endDate) {
  return { url: `${server}/${token}/proposal/session/date/${startDate}/${endDate}/list` };
}

export function getSessionById(sessionId) {
  return { url: `${server}/${token}/proposal/session/${sessionId}/list` };
}

export function getDataCollectionsBy(proposalName, sessionId) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/datacollection/session/${sessionId}/list` };
}
