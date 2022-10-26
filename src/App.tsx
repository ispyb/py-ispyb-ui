import React from 'react';
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import Menu from 'pages/menu/menu';
import LoginPage from 'components/login/loginpage';
import EMSessionPage from 'pages/em/emsessionpage';
import SessionStatisticsPage from 'pages/em/sessionstatisticspage';
import SessionClassificationPage from 'pages/em/classification/sessionclassificationpage';
import MoviesPage from 'pages/em/movie/moviespage';
import SessionsPage from 'pages/sessionspage';
import ProposalsPage from 'pages/proposalspage';
import ErrorBoundary from 'components/errors/errorboundary';
import { useAppSelector } from 'hooks';
import LoadingPanel from 'components/loading/loadingpanel';
import 'App.scss';
import MXWorkflowPage from 'pages/mx/workflow/mxworkflowpage';
import MXDataCollectionGroupPage from 'pages/mx/datacollectiongroup/mxdatacollectiongrouppage';
import ProposalSessionsPage from 'pages/proposalsessionspage';
import MXEnergyScanPage from 'pages/mx/energyscan/mxenergyscanpage';
import MXFluorescencePage from 'pages/mx/fluorescence/fluorescencepage';
import PrepareExperimentPage from 'pages/prepareexperiment/prepareexperimentpage';
import MxFluorescenceViewer from 'pages/mx/fluorescence/fluorescenceviewer';
import ShippingPage from 'pages/shipping/shippingpage';
import ContainerEditPage from 'pages/shipping/container/containereditpage';
import { ImportShippingFromCSV } from 'pages/shipping/csv/importshipping';

export default function App() {
  const user = useAppSelector((state) => state.user);
  const site = useAppSelector((state) => state.site);

  /** Check if there is a site configured */
  if (!site.authentication.sso.enabled && site.authentication.authenticators.length === 0) {
    return <Alert variant="danger">Application is not configured. Site configuration is missing</Alert>;
  }
  if (!user.isAuthenticated) {
    return (
      <BrowserRouter>
        <ErrorBoundary>
          <Menu />
          <LoginPage />
        </ErrorBoundary>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPanel></LoadingPanel>}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<SessionsPage user={user} />} />
            <Route path="/sessions" element={<SessionsPage user={user} />} />
            <Route path="/proposals" element={<ProposalsPage />} />
            <Route path="/:proposalName/sessions" element={<ProposalSessionsPage user={user} />} />
            <Route path="/:proposalName/shipping" element={<ShippingPage />} />
            <Route path="/:proposalName/shipping/:shippingId/dewar/:dewarId/container/:containerId/edit" element={<ContainerEditPage />} />
            <Route path="/:proposalName/shipping/:shippingId/import/csv" element={<ImportShippingFromCSV />} />
            <Route path="/:proposalName/EM/:sessionId" element={<EMSessionPage />} />
            <Route path="/:proposalName/EM/:sessionId/classification" element={<SessionClassificationPage />} />
            <Route path="/:proposalName/EM/:sessionId/statistics" element={<SessionStatisticsPage />} />
            <Route path="/:proposalName/EM/:dataCollectionId/movies" element={<MoviesPage />} />
            <Route path="/:proposalName/MX/:sessionId" element={<MXDataCollectionGroupPage />} />
            <Route path="/:proposalName/MX/:sessionId/energy" element={<MXEnergyScanPage />} />
            <Route path="/:proposalName/MX/:sessionId/xrf" element={<MXFluorescencePage />} />
            <Route path="/:proposalName/MX/:sessionId/xrf/:xrfId" element={<MxFluorescenceViewer />} />
            <Route path="/:proposalName/MX/:sessionId/workflow/:workflowId/steps/:stepsIds" element={<MXWorkflowPage />} />
            <Route path="/:proposalName/MX/:sessionId/workflow/:workflowId/steps/:stepsIds" element={<MXWorkflowPage />} />
            <Route path="/:proposalName/MX/prepare" element={<PrepareExperimentPage />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </BrowserRouter>
  );
}
