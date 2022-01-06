import { SET_SITE } from '../actiontypes';

export function setSite(site) {
  return {
    type: SET_SITE,
    site,
  };
}
