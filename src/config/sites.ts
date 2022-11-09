import { Site } from 'models';

const sites: Site[] = [
  {
    name: 'ESRF-SSX',
    server: 'http://localhost:8000/ispyb/api/v1/legacy',
    server_py: 'http://localhost:8000/ispyb/api/v1',
    description: 'European Synchrotron Radiation Facility',
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
          plugin: 'ldap',
          title: 'ISPyB',
          server: 'http://localhost:8000/ispyb/api/v1/auth/login',
          json: true,
          enabled: true,
          site: 'ESRF',
          message: 'ldap auth',
        },
      ],
    },

    techniques: {
      SSX: { beamlines: [{ name: 'ID29' }] },
    },
  },
  {
    name: 'ESRF',
    server: 'https://ispyb.esrf.fr/ispyb/ispyb-ws/rest',
    description: 'European Synchrotron Radiation Facility',
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
          server: 'https://ispyb.esrf.fr/ispyb/ispyb-ws/rest/authenticate?site=ESRF',
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
          { name: 'ID30A-1', sampleChangerType: 'FlexHCDUnipuckPlate' },
          { name: 'ID30A-2', sampleChangerType: 'FlexHCDDual' },
          { name: 'ID30A-3', sampleChangerType: 'FlexHCDDual' },
          { name: 'ID30B', sampleChangerType: 'FlexHCDDual' },
          { name: 'BM30A', sampleChangerType: 'FlexHCDDual' },
        ],
      },
    },
  },
  {
    name: 'EMBL',
    server: 'https://ispyb.embl-hamburg.de/ispyb/ispyb-ws/rest',
    description: 'European Molecular Biology Laboratory',
    icon: '../images/site/esrf.png',
    authentication: {
      sso: {
        enabled: false,
      },
      authenticators: [
        {
          plugin: 'db',
          title: 'ISPyB',

          server: 'https://ispyb.embl-hamburg.de/ispyb/ispyb-ws/rest',
          enabled: true,
          site: 'EMBL',
          message: 'Use ISPyB authentication when you log in as a proposal',
        },
      ],
    },

    techniques: {
      MX: {
        beamlines: [
          {
            name: 'P13',
          },
          {
            name: 'P14',
          },
        ],
      },
    },
  },

  {
    name: 'MAXIV',
    server: 'https://ispyb.maxiv.lu.se/ispyb/ispyb-ws/rest',
    description: 'MAX IV Laboratory',
    icon: '../images/site/esrf.png',
    authentication: {
      sso: {
        enabled: false,
      },
      authenticators: [
        {
          plugin: 'db',
          title: 'ISPyB',
          server: 'https://ispyb.maxiv.lu.se/ispyb/ispyb-ws/rest',
          enabled: true,
          site: 'MAXIV',
          message: 'Use ISPyB authentication when you log in as a proposal',
        },
      ],
    },

    techniques: {
      MX: {
        beamlines: [
          {
            name: 'BioMAX',
            sampleChangerType: 'ISARA',
          },
        ],
      },
    },
  },
];

export default sites;
