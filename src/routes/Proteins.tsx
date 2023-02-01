import React from 'react';

const ProteinsList = React.lazy(() =>
  import('components/Proteins' /* webpackChunkName: "proteins" */).then(
    (m) => ({
      default: m.ProteinsList,
    })
  )
);

const ViewProtein = React.lazy(() =>
  import('components/Proteins').then((m) => ({
    default: m.ViewProtein,
  }))
);

const ProteinRoutes = {
  path: 'proteins',
  children: [
    { index: true, element: <ProteinsList />, breadcrumb: 'Proteins' },
    { path: ':proteinId', element: <ViewProtein />, breadcrumb: 'View' },
  ],
};

export default ProteinRoutes;
