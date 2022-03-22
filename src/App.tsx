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
import ShippingPage from 'pages/shippingpage';
import PreparePage from 'pages/preparepage';
import ErrorBoundary from 'components/errors/errorboundary';
import Page from 'pages/page';
import { useAppSelector } from 'hooks';
import LoadingPanel from 'components/loading/loadingpanel';
import 'App.scss';
import MXWorkflowPage from 'pages/mx/workflow/mxworkflowpage';
import MXDataCollectionGroupPage from 'pages/mx/datacollectiongroup/mxdatacollectiongrouppage';
import ProposalSessionsPage from 'pages/proposalsessionspage';
import MXEnergyScanPage from 'pages/mx/energyscan/mxenergyscanpage';
import MXFluorescencePage from 'pages/mx/fluorescence/fluorescencepage';
import PrepareExperimentPage from 'pages/prepareexperiment/prepareexperimentpage';

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
      <Menu />
      <Page>
        <Suspense fallback={<LoadingPanel></LoadingPanel>}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<SessionsPage user={user} />} />
              <Route path="/sessions" element={<SessionsPage user={user} />} />
              <Route path="/:proposalName/sessions" element={<ProposalSessionsPage user={user} />} />
              <Route path="/proposals" element={<ProposalsPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/prepare" element={<PreparePage />} />
              <Route path="/:proposalName/EM/:sessionId" element={<EMSessionPage />} />
              <Route path="/:proposalName/EM/:sessionId/classification" element={<SessionClassificationPage />} />
              <Route path="/:proposalName/EM/:sessionId/statistics" element={<SessionStatisticsPage />} />
              <Route path="/:proposalName/EM/:dataCollectionId/movies" element={<MoviesPage />} />
              <Route path="/:proposalName/MX/:sessionId" element={<MXDataCollectionGroupPage />} />
              <Route path="/:proposalName/MX/:sessionId/energy" element={<MXEnergyScanPage />} />
              <Route path="/:proposalName/MX/:sessionId/xrf" element={<MXFluorescencePage />} />
              <Route path="/:proposalName/MX/:sessionId/workflow/:workflowId/steps/:stepsIds" element={<MXWorkflowPage />} />
              <Route path="/:proposalName/MX/:sessionId/workflow/:workflowId/steps/:stepsIds" element={<MXWorkflowPage />} />
              <Route path="/:proposalName/MX/prepare" element={<PrepareExperimentPage />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </Page>
    </BrowserRouter>
  );
}
