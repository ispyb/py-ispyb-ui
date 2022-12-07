import SessionClassificationPage from 'legacy/pages/em/classification/sessionclassificationpage';
import EMSessionPage from 'legacy/pages/em/emsessionpage';
import MoviesPage from 'legacy/pages/em/movie/moviespage';
import SessionStatisticsPage from 'legacy/pages/em/sessionstatisticspage';
import MXDataCollectionGroupPage from 'legacy/pages/mx/datacollectiongroup/mxdatacollectiongrouppage';
import MXEnergyScanPage from 'legacy/pages/mx/energyscan/mxenergyscanpage';
import MXFluorescencePage from 'legacy/pages/mx/fluorescence/fluorescencepage';
import MxFluorescenceViewer from 'legacy/pages/mx/fluorescence/fluorescenceviewer';
import MXWorkflowPage from 'legacy/pages/mx/workflow/mxworkflowpage';
import PrepareExperimentPage from 'legacy/pages/prepareexperiment/prepareexperimentpage';
import ProposalSessionsPage from 'legacy/pages/proposalsessionspage';
import ProposalsPage from 'legacy/pages/proposalspage';
import SessionsPage from 'legacy/pages/sessionspage';
import ContainerEditPage from 'legacy/pages/shipping/container/containereditpage';
import { ImportShippingFromCSV } from 'legacy/pages/shipping/csv/importshipping';
import ShippingPage from 'legacy/pages/shipping/shippingpage';
import { TitledBreadcrumbsRoute } from 'routes';
import {
  BreadcrumbComponentType,
  BreadcrumbMatch,
} from 'use-react-router-breadcrumbs';

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
