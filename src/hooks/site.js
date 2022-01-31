import { store } from 'store';

/**
 * It returns the name of the beamlines per technique as it is defined in config/sites.hs
 * @param {*} technique MX, SAXS, EM, etc..
 * @returns Array with the name of the beamlines. Example: [ID29, ID23-1]
 */
export function useBeamlines(technique) {
  const { beamlines } = store.getState().site;
  return beamlines[technique].map((b) => b.name);
}
