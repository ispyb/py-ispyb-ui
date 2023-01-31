import type {
  BreadcrumbComponentProps,
  BreadcrumbComponentType,
  BreadcrumbMatch,
} from 'use-react-router-breadcrumbs';
import React from 'react';

const EventsList = React.lazy(() =>
  import('components/Events' /* webpackChunkName: "events" */).then((m) => ({
    default: m.EventsList,
  }))
);

const ImageViewer = React.lazy(() =>
  import('components/Events').then((m) => ({
    default: m.ImageViewer,
  }))
);

const SampleChanger = React.lazy(() =>
  import('components/Samples' /* webpackChunkName: "samples" */).then((m) => ({
    default: m.SampleChanger,
  }))
);

const SessionBreadCrumb: BreadcrumbComponentType<'sessionId'> = ({
  match,
}: BreadcrumbComponentProps<'sessionId'>) => {
  return <>{match.params.sessionId}</>;
};

const DataCollectionBreadCrumb: BreadcrumbComponentType<'dataCollectionId'> = ({
  match,
}: BreadcrumbComponentProps<'dataCollectionId'>) => {
  return <>{match.params.dataCollectionId}</>;
};

const EventsRoutes = {
  path: 'sessions',
  children: [
    {
      index: true,
      element: <EventsList refresh />,
      breadcrumb: 'Data Collections',
    },
    {
      path: ':sessionId',
      element: <EventsList refresh />,
      titleBreadcrumb: ({ match }: { match: BreadcrumbMatch<string> }) =>
        match.params.sessionId,
      breadcrumb: SessionBreadCrumb,
    },
    {
      path: ':sessionId/samples',
      element: <SampleChanger />,
      breadcrumb: 'Sample Changer',
    },
    {
      path: ':sessionId/images/:dataCollectionId',
      element: <ImageViewer />,
      breadcrumb: DataCollectionBreadCrumb,
      titleBreadcrumb: ({ match }: { match: BreadcrumbMatch<string> }) =>
        match.params.dataCollectionId,
    },
  ],
};

export default EventsRoutes;
