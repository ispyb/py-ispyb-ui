import { SiteConfig } from 'config/sites';
import {
  LabContact,
  SaveShippingDewar,
  ShippingDewar,
} from 'legacy/pages/shipping/model';

export function getLogin(site: SiteConfig) {
  return `/authenticate?site=${site.javaName}`;
}

export function getSessions() {
  return { url: `/session/list` };
}

export function getSessionsManagerDates(startDate: string, endDate: string) {
  return {
    url: `/proposal/session/date/${startDate}/${endDate}/list`,
  };
}

export function getProposalSessions(proposalName: string) {
  return { url: `/proposal/${proposalName}/session/list` };
}

export function getProposalSessionsWhithDates(
  proposalName: string,
  startDate: string,
  endDate: string
) {
  return {
    url: `/proposal/${proposalName}/session/date/${startDate}/${endDate}/list`,
  };
}

export function getProposal(proposalName?: string) {
  return { url: `/proposal/${proposalName}/info/get` };
}

export function getProposalSamples(proposalName?: string) {
  return { url: `/proposal/${proposalName}/mx/sample/list` };
}

export function getProposals() {
  return { url: `/proposal/list` };
}

export function getSessionById(sessionId: string | undefined) {
  return { url: `/proposal/session/${sessionId}/list` };
}

export function getMXDataCollectionsBy({
  proposalName,
  sessionId,
}: {
  proposalName: string;
  sessionId?: string;
}) {
  return {
    url: `/proposal/${proposalName}/mx/datacollection/session/${sessionId}/list`,
  };
}

export function getMxDataCollectionsByGroupId({
  proposalName,
  dataCollectionGroupId,
}: {
  proposalName: string;
  dataCollectionGroupId: string;
}) {
  return {
    url: `/proposal/${proposalName}/mx/datacollection/datacollectiongroupid/${dataCollectionGroupId}/list`,
  };
}

export function getMXEnergyScans({
  proposalName,
  sessionId,
}: {
  proposalName: string;
  sessionId: string;
}) {
  return {
    url: `/proposal/${proposalName}/mx/energyscan/session/${sessionId}/list`,
  };
}
export function getMXFluorescenceSpectras({
  proposalName,
  sessionId,
}: {
  proposalName: string;
  sessionId: string;
}) {
  return {
    url: `/proposal/${proposalName}/mx/xrfscan/session/${sessionId}/list`,
  };
}

export function getMxWorkflow({
  proposalName,
  stepId,
}: {
  proposalName: string;
  stepId: string;
}) {
  return {
    url: `/proposal/${proposalName}/mx/workflow/step/${stepId}/result`,
  };
}

export function getMXContainers({
  proposalName,
  containerIds,
}: {
  proposalName: string;
  containerIds: string[];
}) {
  const containers = containerIds.length ? containerIds.join(',') : 'null';
  return {
    url: `/proposal/${proposalName}/mx/sample/containerid/${containers}/list`,
  };
}

export function getEMDataCollectionsBy({
  proposalName,
  sessionId,
}: {
  proposalName: string;
  sessionId?: string;
}) {
  return {
    url: `/proposal/${proposalName}/em/datacollection/session/${sessionId}/list`,
  };
}

export function getCrystalImage({
  proposalName,
  dataCollectionId,
  imageIndex,
}: {
  proposalName: string;
  dataCollectionId: number;
  imageIndex: number;
}) {
  return {
    url: `/proposal/${proposalName}/mx/datacollection/${dataCollectionId}/crystalsnaphot/${imageIndex}/get`,
  };
}

export function getEMStatisticsBy({
  proposalName,
  sessionId,
}: {
  proposalName: string;
  sessionId?: string;
}) {
  return {
    url: `/proposal/${proposalName}/em/session/${sessionId}/stats`,
  };
}

export function getEMClassificationBy({
  proposalName,
  sessionId,
}: {
  proposalName: string;
  sessionId?: string;
}) {
  return {
    url: `/proposal/${proposalName}/em/session/${sessionId}/classification`,
  };
}

export function getEmMoviesByDataCollectionId({
  dataCollectionId,
  proposalName,
}: {
  proposalName: string;
  dataCollectionId: number;
}) {
  return {
    url: `/proposal/${proposalName}/em/datacollection/${dataCollectionId}/movie/all`,
  };
}
export function getCTFThumbnail({
  dataCollectionId,
  movieId,
  proposalName,
}: {
  proposalName: string;
  dataCollectionId: number;
  movieId: number;
}) {
  return {
    url: `/proposal/${proposalName}/em/datacollection/${dataCollectionId}/movie/${movieId}/ctf/thumbnail`,
  };
}

export function getMotionCorrectionDrift({
  proposalName,
  dataCollectionId,
  movieId,
}: {
  proposalName: string;
  dataCollectionId: number;
  movieId: number;
}) {
  return {
    url: `/proposal/${proposalName}/em/datacollection/${dataCollectionId}/movie/${movieId}/motioncorrection/drift`,
  };
}

export function getMotionCorrectionThumbnail({
  proposalName,
  dataCollectionId,
  movieId,
}: {
  proposalName: string;
  dataCollectionId: number;
  movieId: number;
}) {
  return {
    url: `/proposal/${proposalName}/em/datacollection/${dataCollectionId}/movie/${movieId}/motioncorrection/thumbnail`,
  };
}
export function getMovieThumbnail({
  proposalName,
  dataCollectionId,
  movieId,
}: {
  proposalName: string;
  dataCollectionId: number;
  movieId: number;
}) {
  return {
    url: `/proposal/${proposalName}/em/datacollection/${dataCollectionId}/movie/${movieId}/thumbnail`,
  };
}

export function getClassificationThumbnail({
  proposalName,
  particleClassificationId,
}: {
  proposalName: string;
  particleClassificationId: number;
}) {
  return {
    url: `/proposal/${proposalName}/em/classification/${particleClassificationId}/thumbnail`,
  };
}

export function getDiffrationThumbnail({
  proposalName,
  imageId,
}: {
  proposalName: string;
  imageId: number;
}) {
  return {
    url: `/proposal/${proposalName}/mx/image/${imageId}/thumbnail`,
  };
}

export function getDozorPlot({
  dataCollectionId,
  proposalName,
}: {
  proposalName: string;
  dataCollectionId: number;
}) {
  return {
    url: `/proposal/${proposalName}/mx/datacollection/${dataCollectionId}/qualityindicatorplot`,
  };
}

export function getJpegchooch({
  energyscanId,
  proposalName,
}: {
  proposalName: string;
  energyscanId: number;
}) {
  return {
    url: `/proposal/${proposalName}/mx/energyscan/energyscanId/${energyscanId}/jpegchooch`,
  };
}

export function getJpegxrfscan({
  proposalName,
  xfeFluorescenceSpectrumId,
}: {
  proposalName: string;
  xfeFluorescenceSpectrumId: number;
}) {
  return {
    url: `/proposal/${proposalName}/mx/xrfscan/xrfscanId/${xfeFluorescenceSpectrumId}/image/jpegScanFileFullPath/get`,
  };
}
export function getMXDataCollectionSummary({
  sessionId,
  proposalName,
  format,
}: {
  proposalName: string;
  sessionId: string;
  format: string;
}) {
  return {
    url: `/proposal/${proposalName}/mx/datacollection/session/${sessionId}/report/${format}`,
  };
}
export function getMXDataCollectionAnalysis({
  sessionId,
  proposalName,
  format,
}: {
  proposalName: string;
  sessionId: string;
  format: string;
}) {
  return {
    url: `/proposal/${proposalName}/mx/datacollection/session/${sessionId}/analysisreport/${format}`,
  };
}

export function getWorkflowImage({
  stepId,
  proposalName,
}: {
  proposalName: string;
  stepId: string;
}) {
  return {
    url: `/proposal/${proposalName}/mx/workflow/step/${stepId}/image`,
  };
}

export function getDewars({ proposalName }: { proposalName: string }) {
  return { url: `/proposal/${proposalName}/dewar/list` };
}

export function updateShippingStatus({
  proposalName,
  shippingId,
  status,
}: {
  proposalName: string;
  shippingId: number;
  status: string;
}) {
  return {
    url: `/proposal/${proposalName}/shipping/${shippingId}/status/${status}/update`,
  };
}

export function updateSampleChangerLocation({
  proposalName,
  containerId,
  beamline,
  position,
}: {
  proposalName: string;
  containerId: number;
  beamline: string;
  position?: string;
}) {
  return {
    url: `/proposal/${proposalName}/container/${containerId}/beamline/${beamline}/samplechangerlocation/update`,
    data: `sampleChangerLocation=${position}`,
    headers: { 'content-type': 'application/x-www-form-urlencoded;' },
  };
}

export function getXrfScanCsv({
  scanId,
  proposalName,
}: {
  proposalName: string;
  scanId: number;
}) {
  return {
    url: `/proposal/${proposalName}/mx/xrfscan/xrfscanId/${scanId}/csv`,
  };
}

export function getLabContacts({ proposalName }: { proposalName: string }) {
  return {
    url: `/proposal/${proposalName}/shipping/labcontact/list`,
  };
}

export function updateLabContact({
  proposalName,
  data,
}: {
  proposalName: string;
  data: LabContact;
}) {
  return {
    url: `/proposal/${proposalName}/shipping/labcontact/save`,
    data: `labcontact=${JSON.stringify(data)}`,
    headers: { 'content-type': 'application/x-www-form-urlencoded;' },
  };
}

export function getShipments({ proposalName }: { proposalName: string }) {
  return { url: `/proposal/${proposalName}/shipping/list` };
}

export function getShipping({
  proposalName,
  shippingId,
}: {
  proposalName: string;
  shippingId: number;
}) {
  return {
    url: `/proposal/${proposalName}/shipping/${shippingId}/get`,
  };
}

export function getShippingHistory({
  proposalName,
  shippingId,
}: {
  proposalName: string;
  shippingId: number;
}) {
  return {
    url: `/proposal/${proposalName}/shipping/${shippingId}/history`,
  };
}

export type SaveShipmentData = {
  shippingId: number | undefined;
  name: string | undefined;
  status: string | undefined;
  sendingLabContactId: number | undefined;
  returnLabContactId: number | undefined;
  returnCourier: number | undefined;
  courierAccount: string | undefined;
  billingReference: string | undefined;
  dewarAvgCustomsValue: number | undefined;
  dewarAvgTransportValue: number | undefined;
  comments: string | undefined;
  sessionId: number | undefined;
};

export function saveShipment({
  proposalName,
  data,
}: {
  proposalName: string;
  data: SaveShipmentData;
}) {
  const d = data as { [key: string]: string | number | undefined };

  const asString = Object.keys(d)
    .map((key) => {
      const v = d[key];
      return `${encodeURIComponent(key)}=${
        v !== undefined ? encodeURIComponent(v) : ''
      }`;
    })
    .join('&');

  return {
    url: `/proposal/${proposalName}/shipping/save`,
    data: asString,
    headers: { 'content-type': 'application/x-www-form-urlencoded;' },
  };
}

export function addDewarsToShipping({
  proposalName,
  shippingId,
  data,
}: {
  proposalName: string;
  shippingId: number;
  data: ShippingDewar[];
}) {
  const jsonData = JSON.stringify(data);

  const encoded = `${encodeURIComponent('dewars')}=${encodeURIComponent(
    jsonData
  )}`;

  return {
    url: `/proposal/${proposalName}/shipping/${shippingId}/dewars/add`,
    data: encoded,
    headers: { 'content-type': 'application/x-www-form-urlencoded;' },
  };
}

export function removeShipping({
  proposalName,
  shippingId,
}: {
  proposalName: string;
  shippingId: number;
}) {
  return {
    url: `/proposal/${proposalName}/shipping/${shippingId}/remove`,
  };
}

export function getShippingContainer({
  proposalName,
  shippingId,
  dewarId,
  containerId,
}: {
  proposalName: string;
  shippingId: string;
  dewarId: string;
  containerId: string;
}) {
  return {
    url: `/proposal/${proposalName}/shipping/${shippingId}/dewar/${dewarId}/puck/${containerId}/get`,
  };
}

export function saveContainer({
  proposalName,
  shippingId,
  dewarId,
  containerId,
  data,
}: {
  proposalName: string;
  shippingId: string;
  dewarId: string;
  containerId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}) {
  const d = JSON.stringify(data);

  const encoded = `puck=${encodeURIComponent(d)}`;

  return {
    url: `/proposal/${proposalName}/shipping/${shippingId}/dewar/${dewarId}/puck/${containerId}/save`,
    data: encoded,
    headers: { 'content-type': 'application/x-www-form-urlencoded;' },
  };
}

export function addContainer({
  proposalName,
  shippingId,
  dewarId,
  containerType,
  capacity,
}: {
  proposalName: string;
  shippingId: string;
  dewarId: string;
  containerType: string;
  capacity: number;
}) {
  return {
    url: `/proposal/${proposalName}/shipping/${shippingId}/dewar/${dewarId}/containerType/${containerType}/capacity/${capacity}/container/add`,
  };
}

export function removeContainer({
  proposalName,
  shippingId,
  dewarId,
  containerId,
}: {
  proposalName: string;
  shippingId: string;
  dewarId: string;
  containerId: string;
}) {
  return {
    url: `/proposal/${proposalName}/shipping/${shippingId}/dewar/${dewarId}/puck/${containerId}/remove`,
  };
}

export function getDewarLabels({
  proposalName,
  shippingId,
  dewarId,
}: {
  proposalName: string;
  shippingId: string;
  dewarId: string;
}) {
  return {
    url: `/proposal/${proposalName}/shipping/${shippingId}/dewar/${dewarId}/labels`,
  };
}

export function getDewarsPdf({
  proposalName,
  sort,
  dewarIds,
}: {
  proposalName: string;
  sort: 1 | 2;
  dewarIds: (string | number | undefined)[];
}) {
  return {
    url: `/proposal/${proposalName}/mx/sample/dewar/${dewarIds
      .filter((d) => d !== undefined)
      .join(',')}/sortView/${sort}/list/pdf`,
  };
}

export function saveParcel({
  proposalName,
  shippingId,
  data,
}: {
  proposalName: string;
  shippingId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: SaveShippingDewar;
}) {
  const d = data as { [key: string]: string | number | boolean | undefined };

  const asString = Object.keys(d)
    .map((key) => {
      const v = d[key];
      return `${encodeURIComponent(key)}=${
        v !== undefined ? encodeURIComponent(v) : ''
      }`;
    })
    .join('&');

  return {
    url: `/proposal/${proposalName}/shipping/${shippingId}/dewar/save`,
    data: asString,
    headers: { 'content-type': 'application/x-www-form-urlencoded;' },
  };
}

export function removeDewar({
  proposalName,
  shippingId,
  dewarId,
}: {
  proposalName: string;
  shippingId: string;
  dewarId: string;
}) {
  return {
    url: `/proposal/${proposalName}/shipping/${shippingId}/dewar/${dewarId}/remove`,
  };
}
