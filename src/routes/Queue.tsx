import React from 'react';

const SubSampleQueue = React.lazy(() =>
  import('components/Queue' /* webpackChunkName: "queue" */).then(
    (m) => ({
      default: m.SampleQueue,
    })
  )
);


const QueueRoutes = {
  path: 'queue',
  children: [
    { index: true, element: <SubSampleQueue />, breadcrumb: 'Queue' },
  ],
};

export default QueueRoutes;
