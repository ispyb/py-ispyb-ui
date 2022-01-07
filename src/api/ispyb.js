import { store } from '../store';

let server = null;

/** This method listen the changes on the store of the server */
store.subscribe(() => {
  server = store.getState().site.server;
});

export function getLogin(site) {
  return server + '/authenticate?site=' + site;
}
