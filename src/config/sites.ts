export interface SiteConfig {
  name: string;
  description?: string;
  host: string;
  apiPrefix: string;
  javaMode?: boolean;
  javaConfig?: JavaSiteConfig;
  javaName?: string;
}

export interface JavaSiteConfig {
  techniques: Record<string, Technique>;
}

export type sampleChangerType =
  | 'FlexHCDDual'
  | 'FlexHCDUnipuckPlate'
  | 'ISARA'
  | 'P11SC';
export type containerType = 'Spinepuck' | 'Unipuck';

export interface Beamline {
  name: string;
  sampleChangerType?: sampleChangerType;
}

export interface Technique {
  beamlines: Array<Beamline>;
}

export const SITES: SiteConfig[] = [
  {
    name: 'ESRF-py',
    description: 'For SSX',
    host: 'http://py-ispyb-development:8888',
    apiPrefix: '/ispyb/api/v1',
  },
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
