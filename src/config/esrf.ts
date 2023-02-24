import { SiteConfig } from 'config/definitions/sites';

export const ESRF: SiteConfig[] = [
  {
    name: 'ESRF-py',
    description: 'For SSX',
    host: 'http://py-ispyb-development:8888',
    apiPrefix: '/ispyb/api/v1',
  },
  {
    name: 'ESRF-Icat',
    description: 'For MX/EM',
    javaName: 'ESRF',
    host: 'http://localhost:8000',
    apiPrefix: '',
    javaMode: true,
    javaConfig: {
      techniques: {
        SAXS: { beamlines: [{ name: 'BM29' }] },
        EM: { beamlines: [{ name: 'CM01' }] },
        MX: {
          beamlines: [
            { name: 'ID23-1', sampleChangerType: 'FlexHCDDual' },
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
];
