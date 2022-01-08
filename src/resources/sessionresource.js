import { Resource } from '@rest-hooks/rest';
import { store } from '../store';

export default class SessionResource extends Resource {
  id = undefined;

  pk() {
    return this.sessionId?.toString();
  }

  static get key() {
    return 'SessionResource';
  }

  static url(params) {
    const { server } = store.getState().site;
    const { token } = store.getState().user;

    return `${server}/${token}/proposal/session/date/20220107/20220108/list`;
  }

  static listUrl(searchParams) {
    const { server } = store.getState().site;
    const { token } = store.getState().user;

    return `${server}/${token}/proposal/session/date/20220107/20220108/list`;
  }
}
