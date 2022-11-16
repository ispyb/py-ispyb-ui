import { Site } from 'models';

const sites: Site[] = [
  {
    name: 'ESRF-SSX',
    server: 'http://lgaonach:8000/ispyb/api/v1/legacy',
    server_py: 'http://lgaonach:8000/ispyb/api/v1',
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
          server: 'http://lgaonach:8000/ispyb/api/v1/auth/login',
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
];

export default sites;
