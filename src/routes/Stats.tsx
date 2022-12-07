import type {
  BreadcrumbComponentType,
  BreadcrumbMatch,
} from 'use-react-router-breadcrumbs';
import SessionStats from 'components/Stats/SessionStats';

const SessionBreadCrumb: BreadcrumbComponentType<'sessionId'> = ({ match }) => {
  return <>{match.params.sessionId}</>;
};

const StatsRoutes = {
  path: 'stats',
  breadcrumb: 'Statistics',
  children: [
    {
      path: ':sessionId',
      element: <SessionStats />,
      titleBreadcrumb: ({ match }: { match: BreadcrumbMatch<string> }) =>
        match.params.sessionId,
      breadcrumb: SessionBreadCrumb,
    },
  ],
};

export default StatsRoutes;
