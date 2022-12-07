import { useAuth } from 'hooks/useAuth';

/**
 * It returns the name of the beamlines per technique as it is defined in config/sites.hs
 * @param {*} technique MX, SAXS, EM, etc..
 * @returns Array with the name of the beamlines. Example: [ID29, ID23-1]
 */
export function useBeamlines(technique: string): Array<string> {
  const { site } = useAuth();
  if (!site.javaConfig?.techniques[technique]) return [];
  return site.javaConfig?.techniques[technique].beamlines.map((b) => b.name);
}

/**
 * It returns the beamline objects per technique as it is defined in config/sites.hs
 * @param {*} technique MX, SAXS, EM, etc..
 * @returns Array with the  beamlines
 */
export function useBeamlinesObjects(technique: string) {
  const { site } = useAuth();
  if (!site.javaConfig?.techniques[technique]) return [];
  return site.javaConfig?.techniques[technique].beamlines;
}

/**
 * It returns the name of the technique for a beamline
 * @param {*} beamline MX, SAXS, EM, etc..
 * @returns Name of the beamline. Example: ID29
 */
export function useGetTechniqueByBeamline(beamline: string): string | null {
  const { site } = useAuth();
  if (site.javaConfig) {
    for (const [techniqueName, technique] of Object.entries(
      site.javaConfig.techniques
    )) {
      if (technique.beamlines.find((b) => b.name === beamline)) {
        return techniqueName;
      }
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

  const mxBeamlines = useBeamlines('MX');
  const saxsBeamlines = useBeamlines('SAXS');
  const emBeamlines = useBeamlines('EM');
  if (areMXColumnsVisible) {
    beamlines = beamlines.concat(mxBeamlines);
  }

  if (areSAXSColumnsVisible) {
    beamlines = beamlines.concat(saxsBeamlines);
  }

  if (areEMColumnsVisible) {
    beamlines = beamlines.concat(emBeamlines);
  }
  return beamlines;
}
