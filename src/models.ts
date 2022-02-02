/********************************************
 * Site: this model descript config/site.js
 /******************************************/
interface Beamline {
  name: string;
  sampleChangerType: string;
}

interface Technique {
  beamlines: Array<Beamline>;
}

interface SSO {
  enabled: boolean;
  plugin?: string;
  configuration?: {
    realm: string;
    url: string;
    clientId: string;
  };
}

interface Authenticator {
  plugin: string;
  title: string;
  server: string;
  enabled: boolean;
  site: string;
}

interface Authentication {
  sso: SSO;
  authenticators: Array<Authenticator>;
}

export interface Site {
  techniques: Record<string, Technique>;
  authentication: Authentication;
  server: string;
}
/********************************************
 * Site 
 /******************************************/
