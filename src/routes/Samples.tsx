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
    { path: ':blSampleId', element: <ViewSample />, breadcrumb: 'View' },
    { path: 'review/:sessionId', element: <SampleReview />, breadcrumb: 'Review' },
  ],
};

export default SampleRoutes;
