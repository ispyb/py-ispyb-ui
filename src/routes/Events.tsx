import type {
  BreadcrumbComponentType,
  BreadcrumbMatch,
} from 'use-react-router-breadcrumbs';
import EventsList from 'components/Events/EventsList';
import SampleChanger from 'components/Samples/SampleChanger';
import ImageViewer from 'components/Events/DataCollections/Braggy/ImageViewer';

const SessionBreadCrumb: BreadcrumbComponentType<'sessionId'> = ({ match }) => {
  return <>{match.params.sessionId}</>;
};

const DataCollectionBreadCrumb: BreadcrumbComponentType<'dataCollectionId'> = ({
  match,
}) => {
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
