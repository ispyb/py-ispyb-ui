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
