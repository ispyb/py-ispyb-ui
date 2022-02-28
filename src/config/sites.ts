import { Site } from 'models';

const sites: Site[] = [
  {
    name: 'ESRF',
    //server: 'http://lgaonach:5000/ispyb/api/v1/legacy',
    server: 'https://ispyb.esrf.fr/ispyb/ispyb-ws/rest',
    description: 'European Synchroton Radiation Facility',
    icon: '../images/site/esrf.png',
    authentication: {
      sso: {
        enabled: false,
        plugin: 'keycloak',
        configuration: {
          realm: 'ESRF',
          url: 'https://websso.esrf.fr/auth/',
          clientId: 'icat',
        },
      },
      authenticators: [
        {
          plugin: 'db',
          title: 'ISPyB',
          server: 'https://ispyb.esrf.fr/ispyb/ispyb-ws/rest',
          enabled: true,
          site: 'ESRF',
          message: 'Use ISPyB authentication when you log in as a proposal',
        },
      ],
    },

    techniques: {
      SAXS: { beamlines: [{ name: 'BM29' }] },
      EM: { beamlines: [{ name: 'CM01' }] },
      MX: {
        beamlines: [
          { name: 'ID23-1', sampleChangerType: 'FlexHCDDual' },
          { name: 'ID23-2', sampleChangerType: 'FlexHCDUnipuckPlate' },
          { name: 'ID29', sampleChangerType: 'FlexHCDDual' },
          { name: 'ID30A-1', sampleChangerType: 'RoboDiffHCDSC3' },
          { name: 'ID30A-2', sampleChangerType: 'FlexHCDDual' },
          { name: 'ID30A-3', sampleChangerType: 'FlexHCDDual' },
          { name: 'ID30B', sampleChangerType: 'FlexHCDDual' },
          { name: 'BM30A', sampleChangerType: 'FlexHCDDual' },
        ],
      },
    },
  },
  {
    name: 'ESRF EM',
    server: 'https://ispyb.esrf.fr/ispyb/ispyb-ws/rest',
    description: 'European Synchroton Radiation Facility',
    icon: '../images/site/esrf.png',
    authentication: {
      sso: {
        enabled: process.env.REACT_APP_SSO_AUTH_ENABLED === 'true',
        plugin: 'keycloak',
        configuration: {
          realm: 'ESRF',
          url: 'https://websso.esrf.fr/auth/',
          clientId: 'icat',
        },
      },
      authenticators: [
        {
          plugin: 'db',
          title: 'ISPyB',
          server: 'https://ispyb.esrf.fr/ispyb/ispyb-ws/rest',
          enabled: true,
          site: 'ESRF',
          message: 'Use ISPyB authentication when you log in as a proposal',
        },
      ],
    },

    techniques: {
      EM: { beamlines: [{ name: 'CM01' }] },
    },
  },
  {
    name: 'Mael SSO',
    server: 'http://lgaonach:5000/ispyb/api/v1/legacy',
    description: 'European Synchroton Radiation Facility',
    icon: '../images/site/esrf.png',
    authentication: {
      sso: {
        enabled: process.env.REACT_APP_SSO_AUTH_ENABLED === 'true',
        plugin: 'keycloak',
        configuration: {
          realm: 'ESRF',
          url: 'https://websso.esrf.fr/auth/',
          clientId: 'icat',
        },
      },
      authenticators: [
        {
          plugin: 'db',
          title: 'ISPyB',
          server: 'https://ispyb.esrf.fr/ispyb/ispyb-ws/rest',
          enabled: true,
          site: 'ESRF',
          message: 'Use ISPyB authentication when you log in as a proposal',
        },
      ],
    },

    techniques: {
      SAXS: { beamlines: [{ name: 'BM29' }] },
      EM: { beamlines: [{ name: 'CM01' }] },
      MX: {
        beamlines: [
          { name: 'ID23-1', sampleChangerType: 'FlexHCDDual' },
          { name: 'ID23-2', sampleChangerType: 'FlexHCDUnipuckPlate' },
          { name: 'ID29', sampleChangerType: 'FlexHCDDual' },
          { name: 'ID30A-1', sampleChangerType: 'RoboDiffHCDSC3' },
          { name: 'ID30A-2', sampleChangerType: 'FlexHCDDual' },
          { name: 'ID30A-3', sampleChangerType: 'FlexHCDDual' },
          { name: 'ID30B', sampleChangerType: 'FlexHCDDual' },
          { name: 'BM30A', sampleChangerType: 'FlexHCDDual' },
        ],
      },
    },
  },
];

export default sites;
