import React from 'react';
const BeamlineOverview = React.lazy(
  () =>
    import(
      'components/BeamlineOverview' /* webpackChunkName: "beamline_overview" */
    )
);

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
