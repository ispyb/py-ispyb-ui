import React from 'react';

const SamplesList = React.lazy(() =>
  import('components/Samples' /* webpackChunkName: "samples" */).then((m) => ({
    default: m.SamplesList,
  }))
);

const SamplesEditor = React.lazy(() =>
  import('components/Samples' /* webpackChunkName: "samples" */).then((m) => ({
    default: m.SamplesEditorPage,
  }))
);

const ViewSample = React.lazy(() =>
  import('components/Samples').then((m) => ({
    default: m.ViewSample,
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
    { path: 'edit', element: <SamplesEditor />, breadcrumb: 'Edit' },
    { path: ':blSampleId', element: <ViewSample />, breadcrumb: 'View' },
  ],
};

export default SampleRoutes;
