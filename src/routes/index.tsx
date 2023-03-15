import {
  BreadcrumbsRoute,
  BreadcrumbMatch,
} from 'use-react-router-breadcrumbs';

import { ProposalsRoutes } from 'routes/Proposals';
import ProposalRoutes from 'routes/Proposal';
import AdminRoutes from 'routes/Admin';
import BeamLineRoutes from 'routes/BeamLine';

import PrivateRoute from 'components/Auth/PrivateRoute';

import PyRoute from 'components/Auth/PyRoute';
import JavaRoute from 'components/Auth/JavaRoute';
import javaRoutes from 'legacy/routes';
import React from 'react';
import Header from 'components/Header';

const Home = React.lazy(
  () => import('components/Home' /* webpackChunkName: "home" */)
);

const Calendar = React.lazy(
  () => import('components/Calendar' /* webpackChunkName: "calendar" */)
);

export interface TitledBreadcrumbsRoute extends BreadcrumbsRoute {
  titleBreadcrumb?: ({ match }: { match: BreadcrumbMatch<string> }) => string;
}

export function NotFound() {
  return <div>Cant find that page: 404</div>;
}

const routes: TitledBreadcrumbsRoute[] = [
  {
    path: '/',
    element: <Header />,
    children: [
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <PyRoute />,
            children: [
              { index: true, element: <Home />, breadcrumb: 'Home' },
              {
                path: 'calendar',
                element: <Calendar />,
                breadcrumb: 'Calendar',
              },
              ProposalsRoutes,
              ProposalRoutes,
              BeamLineRoutes,
              AdminRoutes,
            ],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: 'legacy',
    element: <Header />,
    children: [
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <JavaRoute />,
            children: javaRoutes,
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export default routes;
