import React from 'react';
import { TitledBreadcrumbsRoute } from 'routes';
import {
  BreadcrumbComponentProps,
  BreadcrumbComponentType,
  BreadcrumbMatch,
} from 'use-react-router-breadcrumbs';
import MXSessionPage from '../pages/mx/session/MXSessionPage';
import { Navigate } from 'react-router-dom';

const SessionClassificationPage = React.lazy(() =>
  import(
    'legacy/pages/em/classification' /* webpackChunkName: "legacy_em_classification" */
  ).then((m) => ({
    default: m.SessionClassificationPage,
  }))
);
const EMSessionPage = React.lazy(() =>
  import('legacy/pages/em' /* webpackChunkName: "legacy_em_base" */).then(
    (m) => ({
      default: m.EMSessionPage,
    })
  )
);
const MoviesPage = React.lazy(() =>
  import(
    'legacy/pages/em/movie' /* webpackChunkName: "legacy_em_movie" */
  ).then((m) => ({
    default: m.MoviesPage,
  }))
);
const SessionStatisticsPage = React.lazy(() =>
  import('legacy/pages/em' /* webpackChunkName: "legacy_em_base" */).then(
    (m) => ({
      default: m.SessionStatisticsPage,
    })
  )
);
const MXSessionSummaryPage = React.lazy(() =>
  import(
    'legacy/pages/mx/session/summary' /* webpackChunkName: "legacy_mx_summary" */
  ).then((m) => ({
    default: m.MXSessionSummaryPage,
  }))
);
const MXAcquisitionsPage = React.lazy(() =>
  import(
    'legacy/pages/mx/session/acquisitions' /* webpackChunkName: "legacy_mx_acquisitions" */
  ).then((m) => ({
    default: m.MXAcquisitionsPage,
  }))
);
const MxFluorescenceViewer = React.lazy(() =>
  import(
    'legacy/pages/mx/dataset/fluorescence' /* webpackChunkName: "legacy_mx_fluo" */
  ).then((m) => ({
    default: m.MxFluorescenceViewer,
  }))
);
const MXWorkflowPage = React.lazy(() =>
  import(
    'legacy/pages/mx/workflow' /* webpackChunkName: "legacy_mx_workflow" */
  ).then((m) => ({
    default: m.MXWorkflowPage,
  }))
);
const PrepareExperimentPage = React.lazy(() =>
  import(
    'legacy/pages/prepareexperiment' /* webpackChunkName: "legacy_prepare_exp" */
  ).then((m) => ({
    default: m.PrepareExperimentPage,
  }))
);
const ProposalSessionsPage = React.lazy(() =>
  import('legacy/pages' /* webpackChunkName: "legacy_base" */).then((m) => ({
    default: m.ProposalSessionsPage,
  }))
);
const ProposalsPage = React.lazy(() =>
  import('legacy/pages' /* webpackChunkName: "legacy_base" */).then((m) => ({
    default: m.ProposalsPage,
  }))
);
const SessionsPage = React.lazy(() =>
  import('legacy/pages' /* webpackChunkName: "legacy_base" */).then((m) => ({
    default: m.SessionsPage,
  }))
);
const ContainerEditPage = React.lazy(() =>
  import(
    'legacy/pages/shipping/container' /* webpackChunkName: "legacy_shipping_container" */
  ).then((m) => ({
    default: m.ContainerEditPage,
  }))
);
const ImportShippingFromCSV = React.lazy(() =>
  import(
    'legacy/pages/shipping/csv' /* webpackChunkName: "legacy_shipping_csv" */
  ).then((m) => ({
    default: m.ImportShippingFromCSV,
  }))
);
const ShippingPage = React.lazy(() =>
  import(
    'legacy/pages/shipping' /* webpackChunkName: "legacy_shipping_base" */
  ).then((m) => ({
    default: m.ShippingPage,
  }))
);

const ProposalBreadCrumb: BreadcrumbComponentType<'proposalName'> = ({
  match,
}: BreadcrumbComponentProps<'proposalName'>) => {
  return <>{match.params.proposalName}</>;
};

const javaRoutes: TitledBreadcrumbsRoute[] = [
  { index: true, element: <Navigate to="sessions/list" />, breadcrumb: null },
  { path: 'sessions/list', element: <SessionsPage />, breadcrumb: 'Sessions' },
  {
    path: 'proposals/list',
    element: <ProposalsPage />,
    breadcrumb: 'Proposals',
  },
  {
    path: 'proposals/:proposalName',
    breadcrumb: ProposalBreadCrumb,
    titleBreadcrumb: ({ match }: { match: BreadcrumbMatch<string> }) => {
      return match.params.proposalName || '';
    },
    children: [
      {
        path: 'sessions',
        children: [
          {
            index: true,
            element: <ProposalSessionsPage />,
            breadcrumb: 'Sessions',
          },
        ],
      },
      {
        path: 'shipping',
        children: [
          {
            index: true,
            element: <ShippingPage />,
            breadcrumb: 'Shipping',
          },
          {
            path: ':shippingId',
            children: [
              {
                path: 'dewar/:dewarId/container/:containerId/edit',
                element: <ContainerEditPage />,
                breadcrumb: 'Edit',
              },
              {
                path: 'import/csv',
                element: <ImportShippingFromCSV />,
                breadcrumb: 'CSV',
              },
            ],
          },
        ],
      },
      {
        path: 'EM',
        breadcrumb: 'EM',
        children: [
          {
            path: ':sessionId',
            children: [
              { path: 'summary', element: <EMSessionPage /> },
              {
                path: 'classification',
                element: <SessionClassificationPage />,
              },
              {
                path: 'statistics',
                element: <SessionStatisticsPage />,
              },
              {
                path: ':dataCollectionId/movies',
                element: <MoviesPage />,
              },
            ],
          },
        ],
      },
      {
        path: 'MX',
        breadcrumb: 'MX',
        children: [
          { path: 'prepare', element: <PrepareExperimentPage /> },
          {
            path: ':sessionId',
            element: <MXSessionPage />,
            children: [
              { path: 'summary', element: <MXSessionSummaryPage /> },
              { path: 'collection', element: <MXAcquisitionsPage /> },
              {
                path: 'xrf',
                children: [
                  { path: ':xrfId', element: <MxFluorescenceViewer /> },
                ],
              },
              {
                path: ':dataCollectionId/movies',
                element: <MoviesPage />,
              },
              {
                path: 'workflow/:workflowId/steps/:stepsIds',
                element: <MXWorkflowPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default javaRoutes;
