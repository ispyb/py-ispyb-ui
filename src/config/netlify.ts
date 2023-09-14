import { SiteConfig } from 'config/definitions/sites';

export const NETLIFY: SiteConfig[] = [
  {
    name: 'ESRF-java',
    description: 'For MX/EM',
    javaName: 'ESRF',
    host: 'https://ispyb.esrf.fr',
    apiPrefix: '/ispyb/ispyb-ws/rest',
    javaMode: true,
    javaConfig: {
      techniques: {
        SAXS: { beamlines: [{ name: 'BM29' }] },
        EM: { beamlines: [{ name: 'CM01' }] },
        MX: {
          beamlines: [
            { name: 'ID23-1', sampleChangerType: 'FlexHCDDualID231' },
            { name: 'ID23-2', sampleChangerType: 'FlexHCDUnipuckPlate' },
            { name: 'ID29', sampleChangerType: 'FlexHCDDual' },
            { name: 'ID30A-1', sampleChangerType: 'FlexHCDUnipuckPlate' },
            { name: 'ID30A-2', sampleChangerType: 'FlexHCDDual' },
            { name: 'ID30A-3', sampleChangerType: 'FlexHCDDual' },
            { name: 'ID30B', sampleChangerType: 'FlexHCDDual' },
            { name: 'BM30A', sampleChangerType: 'FlexHCDDual' },
          ],
        },
      },
    },
  },
  {
    name: 'ALBA',
    description: 'For MX@ALBA',
    javaName: 'ALBA',
    host: 'https://ispyb.cells.es',
    apiPrefix: '/ispyb/ispyb-ws/rest',
    javaMode: true,
    javaConfig: {
      techniques: {
        MX: {
          beamlines: [
            {
              name: 'BL13 - XALOC',
              sampleChangerType: 'FlexHCDDual',
            },
          ],
        },
      },
    },
  },
];
