import { SiteConfig } from 'config/definitions/sites';

export const MAXIV: SiteConfig[] = [
  {
    name: 'MAXIV-java',
    description: 'For MX/EM',
    javaName: 'MAXIV',
    host: 'https://ispyb.maxiv.lu.se',
    apiPrefix: '/ispyb/ispyb-ws/rest',
    javaMode: true,
    javaConfig: {
      techniques: {
        MX: {
          beamlines: [
            { name: 'BioMAX', sampleChangerType: 'FlexHCDDual' },
            { name: 'MicroMAX', sampleChangerType: 'FlexHCDUnipuckPlate' },
          ],
        },
      },
    },
  },
];
