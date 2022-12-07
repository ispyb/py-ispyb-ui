import BeamlineOverview from 'components/BeamlineOverview';

const BeamLineRoutes = {
  path: 'beamline',
  breadcrumb: 'Beamline',
  children: [
    {
      path: ':beamLineName',
      element: <BeamlineOverview />,
      breadcrumb: 'Overview',
    },
  ],
};

export default BeamLineRoutes;
