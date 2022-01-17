const techniques = {
  SAXS: { enabled: true, beamlines: [{ name: 'BM29' }] },
  EM: { enabled: true, beamlines: [{ name: 'CM01' }] },
  MX: {
    enabled: true,
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
};

export default techniques;
