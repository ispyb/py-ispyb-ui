/********************************************
 * Site: this model descript config/site.js
 /******************************************/
interface Beamline {
  name: string;
  sampleChangerType?: string;
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
  message?: string;
}

interface Authentication {
  sso: SSO;
  authenticators: Array<Authenticator>;
}

export interface Site {
  techniques: Record<string, Technique>;
  authentication: Authentication;
  server: string;
  name: string;
  description: string;
  icon: string;
}
/********************************************
 * User 
 /******************************************/

export interface User {
  username: string;
  roles: string;
  token: string;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isError: boolean;
  type: string;
  error: string;
  isSSO: boolean;
  isManager: boolean;
}
