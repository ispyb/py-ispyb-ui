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

export type Parcel = {
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

export type Shipment = Parcel & {
  parcels: Parcel[];
  parcelCount: number;
  sampleCount: number;
};
