import React from 'react';

const SamplesList = React.lazy(() =>
  import('components/Samples' /* webpackChunkName: "samples" */).then((m) => ({
    default: m.SamplesList,
  }))
);

const ViewSample = React.lazy(() =>
  import('components/Samples').then((m) => ({
    default: m.ViewSample,
  }))
);

const SampleReview = React.lazy(() =>
  import('components/Samples').then((m) => ({
    default: m.SampleReview,
  }))
);

const SampleRoutes = {
  path: 'samples',
  children: [
    {
      index: true,
      element: <SamplesList focusSearch />,
      breadcrumb: 'Samples',
    },
    { path: 'review', element: <SampleReview />, breadcrumb: 'Review' },
    { path: ':blSampleId', element: <ViewSample />, breadcrumb: 'View' },
  ],
};

export default SampleRoutes;
