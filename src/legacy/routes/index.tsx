import React from 'react';
import { TitledBreadcrumbsRoute } from 'routes';
import {
  BreadcrumbComponentType,
  BreadcrumbMatch,
} from 'use-react-router-breadcrumbs';

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
const MXDataCollectionGroupPage = React.lazy(() =>
  import(
    'legacy/pages/mx/datacollectiongroup' /* webpackChunkName: "legacy_mx_dcg" */
  ).then((m) => ({
    default: m.MXDataCollectionGroupPage,
  }))
);
const MXEnergyScanPage = React.lazy(() =>
  import(
    'legacy/pages/mx/energyscan' /* webpackChunkName: "legacy_mx_energy" */
  ).then((m) => ({
    default: m.MXEnergyScanPage,
  }))
);
const MXFluorescencePage = React.lazy(() =>
  import(
    'legacy/pages/mx/fluorescence' /* webpackChunkName: "legacy_mx_fluo" */
  ).then((m) => ({
    default: m.MXFluorescencePage,
  }))
);
const MxFluorescenceViewer = React.lazy(() =>
  import(
    'legacy/pages/mx/fluorescence' /* webpackChunkName: "legacy_mx_fluo" */
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
}) => {
  return <>{match.params.proposalName}</>;
};

const javaRoutes: TitledBreadcrumbsRoute[] = [
  { index: true, element: <SessionsPage />, breadcrumb: null },
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
            children: [
              { path: 'summary', element: <MXDataCollectionGroupPage /> },
              {
                path: 'energy',
                element: <MXEnergyScanPage />,
              },
              {
                path: 'xrf',
                children: [
                  { index: true, element: <MXFluorescencePage /> },
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
