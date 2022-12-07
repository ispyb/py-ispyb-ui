import { containerType } from 'legacy/models';
import { Crystal, DiffractionPlan } from 'legacy/pages/model';

export type LabContact = {
  labContactId: number;
  personVO: PersonV0;
  cardName: string;
  defaultCourrierCompany: string;
  courierAccount: string;
  billingReference: string;
  dewarAvgCustomsValue: number;
  dewarAvgTransportValue: number;
};

export type PersonV0 = {
  personId: number;
  laboratoryVO: LaboratoryVO;
  siteId: string;
  personUUID: string;
  familyName: string;
  givenName: string;
  title: string;
  emailAddress: string;
  phoneNumber: string;
  login: string;
  faxNumber: string;
  externalId: string;
};

export type LaboratoryVO = {
  laboratoryId: number;
  laboratoryUUID: string;
  name: string;
  address: string;
  city: string;
  country: string;
  url: string;
  organization: string;
  laboratoryExtPk: string;
};

export type Container = {
  Container_beamlineLocation?: string;
  Container_bltimeStamp: string;
  Container_capacity: number;
  Container_code: string;
  Container_containerId: number;
  Container_containerStatus: string;
  Container_containerType: string;
  Container_dewarId: number;
  Container_sampleChangerLocation?: string;
  Dewar_barCode?: string;
  Dewar_bltimeStamp: string;
  Dewar_code: string;
  Dewar_comments: string;
  Dewar_customsValue: number;
  Dewar_dewarId: number;
  Dewar_dewarStatus: string;
  Dewar_firstExperimentId?: string;
  Dewar_isReimbursed: false;
  Dewar_isStorageDewar: false;
  Dewar_shippingId: number;
  Dewar_storageLocation?: string;
  Dewar_trackingNumberFromSynchrotron?: string;
  Dewar_trackingNumberToSynchrotron?: string;
  Dewar_transportValue: number;
  Dewar_type: string;
  Shipping_bltimeStamp: string;
  Shipping_comments?: string;
  Shipping_creationDate?: string;
  Shipping_dateOfShippingToUser?: string;
  Shipping_deliveryAgent_agentCode: string;
  Shipping_deliveryAgent_agentName: string;
  Shipping_deliveryAgent_deliveryDate?: string;
  Shipping_deliveryAgent_flightCode?: string;
  Shipping_deliveryAgent_shippingDate: string;
  Shipping_isStorageShipping: false;
  Shipping_laboratoryId: number;
  Shipping_proposalId: number;
  Shipping_returnCourier?: string;
  Shipping_returnLabContactId?: string;
  Shipping_sendingLabContactId?: string;
  Shipping_shippingId: number;
  Shipping_shippingName: string;
  Shipping_shippingStatus: string;
  Shipping_shippingType: string;
  sampleCount: number;
  stockSolutionCount: number;
};

export type Parcel = Container & {
  containers: Container[];
  sampleCount: number;
};

export type Shipment = Parcel & {
  parcels: Parcel[];
  parcelCount: number;
  sampleCount: number;
};

export interface Shipping {
  comments: string;
  creationDate: string;
  dateOfShippingToUser?: string;
  deliveryAgentAgentCode?: string;
  deliveryAgentAgentName?: string;
  deliveryAgentDeliveryDate?: string;
  deliveryAgentFlightCode?: string;
  deliveryAgentShippingDate?: string;
  dewarVOs: ShippingDewar[];
  isStorageShipping?: string;
  laboratoryId?: string;
  returnCourier?: string;
  returnLabContactVO: LabContact;
  sendingLabContactVO: LabContact;
  sessions: ShippingSession[];
  shippingId: number;
  shippingName: string;
  shippingStatus: string;
  shippingType: string;
  timeStamp: string;
}

export interface ShippingDewar extends SaveShippingDewar {
  containerVOs: ShippingContainer[];
  sessionVO?: ShippingSession;
}
export type SaveShippingDewar = {
  barCode?: string;
  code: string;
  comments?: string;
  customsValue?: string;
  dewarId?: number;
  dewarStatus?: string;
  facilityCode?: string;
  isReimbursed?: boolean;
  isStorageDewar?: string;
  storageLocation?: string;
  timeStamp?: string;
  trackingNumberFromSynchrotron?: string;
  trackingNumberToSynchrotron?: string;
  transportValue?: number;
  type: string;
};

export interface ShippingContainer {
  barcode?: string;
  beamlineLocation?: string;
  capacity: number;
  code: string;
  containerId?: number;
  containerStatus?: string;
  containerType: containerType | undefined;
  sampleChangerLocation?: string;
  sampleVOs: ShippingSample[];
}

export interface ShippingSample {
  blSampleId?: number;
  blSampleStatus?: string;
  code?: string;
  comments?: string;
  completionStage?: string;
  crystalVO?: Crystal;
  diffractionPlanVO: DiffractionPlan;
  holderLength?: string;
  isInSampleChanger?: string;
  lastImageURL?: string;
  lastKnownCenteringPosition?: string;
  location?: string;
  loopLength?: string;
  loopType?: string;
  name?: string;
  publicationComments?: string;
  publicationStage?: string;
  smiles?: string;
  structureStage?: string;
  wireWidth?: string;
}

export interface ShippingSession {
  beamLineSetupVO?: string;
  beamlineName: string;
  beamlineOperator?: string;
  comments: string;
  databackupEurope?: string;
  databackupFrance?: string;
  dewarTransport?: string;
  endDate: string;
  expSessionPk?: string;
  externalId?: string;
  lastUpdate: string;
  nbReimbDewars?: string;
  nbShifts: number;
  operatorSiteNumber?: string;
  projectCode?: string;
  protectedData?: string;
  scheduled: number;
  sessionId: number;
  sessionTitle?: string;
  startDate: string;
  structureDeterminations?: string;
  timeStamp: string;
  usedFlag?: string;
  visit_number?: string;
  proposalVO: ShippingProposal;
}

export interface ShippingProposal {
  code: string;
  externalId?: string;
  number: string;
  proposalId: number;
  timeStamp: string;
  title: string;
  type: string;
}

export type ShippingHistory = ShippingHistoryEntry[];
export interface ShippingHistoryEntry {
  DewarTransportHistory_DewarTransportHistoryId: number;
  DewarTransportHistory_arrivalDate: string;
  DewarTransportHistory_dewarStatus: string;
  DewarTransportHistory_storageLocation: string;
  Dewar_barCode: string;
  Dewar_code: string;
  Dewar_comments: string;
  Dewar_dewarId: number;
  Dewar_dewarStatus: string;
  Dewar_firstExperimentId: number;
  Dewar_trackingNumberFromSynchrotron: string;
  Dewar_trackingNumberToSynchrotron: string;
  Dewar_type: string;
  Shipping_dateOfShippingToUser?: string;
  Shipping_deliveryAgent_deliveryDate?: string;
  Shipping_deliveryAgent_shippingDate?: string;
  Shipping_proposalId: number;
  Shipping_returnCourier?: string;
  Shipping_shippingId: number;
  Shipping_shippingName: string;
  Shipping_shippingStatus: string;
  deliveryAgent_agentName?: string;
}
