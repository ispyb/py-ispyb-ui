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
