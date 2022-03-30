import { store } from 'store';
import { Site } from 'models';

let server = '';
let token = '';
/** This method listen the changes on the store of the server */
store.subscribe(() => {
  server = store.getState().site.server;
  token = store.getState().user.token;
});

export function getLogin(site: Site) {
  return `${server}/authenticate?site=${site}`;
}

export function getSessions() {
  return { url: `${server}/${token}/session/list` };
}

export function getSessionsManagerDates(startDate: string, endDate: string) {
  return { url: `${server}/${token}/proposal/session/date/${startDate}/${endDate}/list` };
}

export function getProposalSessions(proposalName: string) {
  return { url: `${server}/${token}/proposal/${proposalName}/session/list` };
}

export function getProposalSessionsWhithDates(proposalName: string, startDate: string, endDate: string) {
  return { url: `${server}/${token}/proposal/${proposalName}/session/date/${startDate}/${endDate}/list` };
}

export function getProposal(proposalName?: string) {
  return { url: `${server}/${token}/proposal/${proposalName}/info/get` };
}

export function getProposals() {
  return { url: `${server}/${token}/proposal/list` };
}

export function getSessionById(sessionId: string | undefined) {
  return { url: `${server}/${token}/proposal/session/${sessionId}/list` };
}

export function getMXDataCollectionsBy({ proposalName, sessionId }: { proposalName: string; sessionId?: string }) {
  return { url: `${server}/${token}/proposal/${proposalName}/mx/datacollection/session/${sessionId}/list` };
}

export function getMxDataCollectionsByGroupId({ proposalName, dataCollectionGroupId }: { proposalName: string; dataCollectionGroupId: string }) {
  return { url: `${server}/${token}/proposal/${proposalName}/mx/datacollection/datacollectiongroupid/${dataCollectionGroupId}/list` };
}

export function getMXEnergyScans({ proposalName, sessionId }: { proposalName: string; sessionId: string }) {
  return { url: `${server}/${token}/proposal/${proposalName}/mx/energyscan/session/${sessionId}/list` };
}
export function getMXFluorescenceSpectras({ proposalName, sessionId }: { proposalName: string; sessionId: string }) {
  return { url: `${server}/${token}/proposal/${proposalName}/mx/xrfscan/session/${sessionId}/list` };
}

export function getMxWorkflow({ proposalName, stepId }: { proposalName: string; stepId: string }) {
  return { url: `${server}/${token}/proposal/${proposalName}/mx/workflow/step/${stepId}/result` };
}

export function getMXContainers({ proposalName, containerIds }: { proposalName: string; containerIds: string[] }) {
  return { url: `${server}/${token}/proposal/${proposalName}/mx/sample/containerid/${containerIds.join(',')}/list` };
}

export function getEMDataCollectionsBy({ proposalName, sessionId }: { proposalName: string; sessionId?: string }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/datacollection/session/${sessionId}/list` };
}

export function getCrystalImage({ proposalName, dataCollectionId, imageIndex }: { proposalName: string; dataCollectionId: number; imageIndex: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/mx/datacollection/${dataCollectionId}/crystalsnaphot/${imageIndex}/get` };
}

export function getEMStatisticsBy({ proposalName, sessionId }: { proposalName: string; sessionId?: string }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/session/${sessionId}/stats` };
}

export function getEMClassificationBy({ proposalName, sessionId }: { proposalName: string; sessionId?: string }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/session/${sessionId}/classification` };
}

export function getEmMoviesByDataCollectionId({ dataCollectionId, proposalName }: { proposalName: string; dataCollectionId: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/datacollection/${dataCollectionId}/movie/all` };
}
export function getCTFThumbnail({ dataCollectionId, movieId, proposalName }: { proposalName: string; dataCollectionId: number; movieId: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/datacollection/${dataCollectionId}/movie/${movieId}/ctf/thumbnail` };
}

export function getMotionCorrectionDrift({ proposalName, dataCollectionId, movieId }: { proposalName: string; dataCollectionId: number; movieId: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/datacollection/${dataCollectionId}/movie/${movieId}/motioncorrection/drift` };
}

export function getMotionCorrectionThumbnail({ proposalName, dataCollectionId, movieId }: { proposalName: string; dataCollectionId: number; movieId: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/datacollection/${dataCollectionId}/movie/${movieId}/motioncorrection/thumbnail` };
}
export function getMovieThumbnail({ proposalName, dataCollectionId, movieId }: { proposalName: string; dataCollectionId: number; movieId: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/datacollection/${dataCollectionId}/movie/${movieId}/thumbnail` };
}

export function getClassificationThumbnail({ proposalName, particleClassificationId }: { proposalName: string; particleClassificationId: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/em/classification/${particleClassificationId}/thumbnail` };
}

export function getDiffrationThumbnail({ proposalName, imageId }: { proposalName: string; imageId: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/mx/image/${imageId}/thumbnail` };
}

export function getDozorPlot({ dataCollectionId, proposalName }: { proposalName: string; dataCollectionId: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/mx/datacollection/${dataCollectionId}/qualityindicatorplot` };
}

export function getJpegchooch({ energyscanId, proposalName }: { proposalName: string; energyscanId: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/mx/energyscan/energyscanId/${energyscanId}/jpegchooch` };
}

export function getJpegxrfscan({ proposalName, xfeFluorescenceSpectrumId }: { proposalName: string; xfeFluorescenceSpectrumId: number }) {
  return { url: `${server}/${token}/proposal/${proposalName}/mx/xrfscan/xrfscanId/${xfeFluorescenceSpectrumId}/image/jpegScanFileFullPath/get` };
}
export function getMXDataCollectionSummary({ sessionId, proposalName, format }: { proposalName: string; sessionId: string; format: string }) {
  return { url: `${server}/${token}/proposal/${proposalName}/mx/datacollection/session/${sessionId}/report/${format}` };
}
export function getMXDataCollectionAnalysis({ sessionId, proposalName, format }: { proposalName: string; sessionId: string; format: string }) {
  return { url: `${server}/${token}/proposal/${proposalName}/mx/datacollection/session/${sessionId}/analysisreport/${format}` };
}

export function getWorkflowImage({ stepId, proposalName }: { proposalName: string; stepId: string }) {
  return { url: `${server}/${token}/proposal/${proposalName}/mx/workflow/step/${stepId}/image` };
}

export function getDewars({ proposalName }: { proposalName: string }) {
  return { url: `${server}/${token}/proposal/${proposalName}/dewar/list` };
}

export function updateShippingStatus({ proposalName, shippingId, status }: { proposalName: string; shippingId: number; status: string }) {
  return { url: `${server}/${token}/proposal/${proposalName}/shipping/${shippingId}/status/${status}/update` };
}

export function updateSampleChangerLocation({ proposalName, containerId, beamline, position }: { proposalName: string; containerId: number; beamline: string; position?: string }) {
  return {
    url: `${server}/${token}/proposal/${proposalName}/container/${containerId}/beamline/${beamline}/samplechangerlocation/update`,
    data: `sampleChangerLocation=${position}`,
  };
}
