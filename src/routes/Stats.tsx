import type {
  BreadcrumbComponentType,
  BreadcrumbMatch,
  BreadcrumbComponentProps,
} from 'use-react-router-breadcrumbs';
import React from 'react';

const SessionBreadCrumb: BreadcrumbComponentType<'sessionId'> = ({
  match,
}: BreadcrumbComponentProps<'sessionId'>) => {
  return <>{match.params.sessionId}</>;
};

const SessionStats = React.lazy(() =>
  import('components/Stats' /* webpackChunkName: "stats" */).then((m) => ({
    default: m.SessionStats,
  }))
);

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
