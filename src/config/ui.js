const UI = {
  theme: 'cosmo', //(examples: darkly, slate, cosmo, spacelab, and superhero, minty, flatly. See https://bootswatch.com/ for current theme names.
  sessionsPage: {
    areMXColumnsVisible: true,
    areSAXSColumnsVisible: false,
    areEMColumnsVisible: false,
    userPortalLink: {
      visible: true,
      header: 'A-Form',
      url: 'https://smis.esrf.fr/misapps/SMISWebClient/protected/aform/manageAForm.do?action=view&currentTab=howtoTab&expSessionVO.pk=',
      toolTip: 'Click to access to the A-form in the User Portal',
    },
  },

  loginForm: {
    header: '',
    /** Text displayed on top of the username sigin form. Someone can customize the text as: User office account, ESRF Account, Umbrella account, etc... */
    usernameLabel: 'Username',
    ssoBtnLabel: 'Sign in with ESRF SSO',
  },

  MX: {
    showQualityIndicatorPlot: true, // It shows or hides the quality indicator plot from the summary tab of a datacollection
    showCollectionTab: true,
    showCrystalSnapshot1: true,
    showCrystalSnapshot2: true,
    showCrystalSnapshot3: true,
    showCrystalSnapshot4: true,
  },
};

export default UI;
