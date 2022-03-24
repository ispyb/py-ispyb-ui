import { store } from 'store';
import { Site } from 'models';

/**
 * It returns the name of the beamlines per technique as it is defined in config/sites.hs
 * @param {*} technique MX, SAXS, EM, etc..
 * @returns Array with the name of the beamlines. Example: [ID29, ID23-1]
 */
export function useBeamlines(technique: string): Array<string> {
  const site: Site = store.getState().site;
  if (!site.techniques[technique]) return [];
  return site.techniques[technique].beamlines.map((b) => b.name);
}

/**
 * It returns the beamline objects per technique as it is defined in config/sites.hs
 * @param {*} technique MX, SAXS, EM, etc..
 * @returns Array with the  beamlines
 */
export function useBeamlinesObjects(technique: string) {
  const site: Site = store.getState().site;
  if (!site.techniques[technique]) return [];
  return site.techniques[technique].beamlines;
}

/**
 * It returns the name of the technique for a beamline
 * @param {*} beamline MX, SAXS, EM, etc..
 * @returns Name of the beamline. Example: ID29
 */
export function useGetTechniqueByBeamline(beamline: string): string | null {
  const site: Site = store.getState().site;
  for (const [techniqueName, technique] of Object.entries(site.techniques)) {
    if (technique.beamlines.find((b) => b.name === beamline)) {
      return techniqueName;
    }
  }
  return null;
}

export function useGetBeamlines({
  areMXColumnsVisible,
  areSAXSColumnsVisible,
  areEMColumnsVisible,
}: {
  areMXColumnsVisible: boolean;
  areSAXSColumnsVisible: boolean;
  areEMColumnsVisible: boolean;
}): string[] {
  let beamlines: string[] = [];
  if (areMXColumnsVisible) {
    beamlines = beamlines.concat(useBeamlines('MX'));
  }

  if (areSAXSColumnsVisible) {
    beamlines = beamlines.concat(useBeamlines('SAXS'));
  }

  if (areEMColumnsVisible) {
    beamlines = beamlines.concat(useBeamlines('EM'));
  }
  return beamlines;
}
