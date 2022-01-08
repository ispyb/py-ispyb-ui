const sites = [
  {
    name: 'ESRF',
    //server: 'http://localhost:8080/ispyb/ispyb-ws/rest',
    server: 'https://ispyb.esrf.fr/ispyb/ispyb-ws/rest',
    description: 'European Synchroton Radiation Facility',
    icon: '../images/site/esrf.png',
    authentication: {
      sso: {
        enabled: process.env.REACT_APP_SSO_AUTH_ENABLED === 'true',
        plugin: 'esrf',
        configuration: {
          realm: 'ESRF',
          url: 'https://websso.esrf.fr/auth/',
          clientId: 'icat'
        }
      },
      authenticators: [
        {
          plugin: 'db',
          title: 'ISPyB',
          server: 'https://ispyb.esrf.fr/ispyb/ispyb-ws/rest',
          enabled: true,
          site: 'ESRF'
        }
      ]
    },
    settings: {
      themes: [
        'cerulean',
        'cosmo',
        'cyborg',
        'darkly',
        'flatly',
        'journal',
        'lumen',
        'paper',
        'readable',
        'sandstone',
        'simplex',
        'slate',
        'spacelab',
        'superhero',
        'united',
        'yeti'
      ],
      MX: {
        showQualityIndicatorPlot: true, // It shows or hides the quality indicator plot from the summary tab of a datacollection
        showCollectionTab: true,
        showCrystalSnapshot1: true,
        showCrystalSnapshot2: true,
        showCrystalSnapshot3: true,
        showCrystalSnapshot4: true
      }
    },
    beamlines: {
      SAXS: [{ name: 'BM29' }],
      EM: [{ name: 'CM01' }],
      MX: [
        { name: 'ID23-1', sampleChangerType: 'FlexHCDDual' },
        { name: 'ID23-2', sampleChangerType: 'FlexHCDUnipuckPlate' },
        { name: 'ID29', sampleChangerType: 'FlexHCDDual' },
        { name: 'ID30A-1', sampleChangerType: 'RoboDiffHCDSC3' },
        { name: 'ID30A-2', sampleChangerType: 'FlexHCDDual' },
        { name: 'ID30A-3', sampleChangerType: 'FlexHCDDual' },
        { name: 'ID30B', sampleChangerType: 'FlexHCDDual' },
        { name: 'BM30A', sampleChangerType: 'FlexHCDDual' }
      ]
    }
  }
];

export default sites;
