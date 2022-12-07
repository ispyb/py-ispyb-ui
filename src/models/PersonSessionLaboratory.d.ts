/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Siteid = number;
export type Personuuid = string;
export type Familyname = string;
export type Givenname = string;
export type Title = string;
export type Emailaddress = string;
export type Phonenumber = string;
export type Login = string;
export type Passwd = string;
export type Faxnumber = string;
export type Externalid = number;
export type Cache = string;
/**
 * The Laboratory name
 */
export type LaboratoryName = string;
/**
 * The Laboratory Address
 */
export type Address = string;
/**
 * The Laboratory City
 */
export type City = string;
/**
 * The Laboratory Country
 */
export type Country = string;
/**
 * The Laboratory optional URL
 */
export type URL = null | string;
/**
 * External Id from the User Portal
 */
export type LaboratoryExtPk = null | number;
export type Role =
  | "Local Contact"
  | "Local Contact 2"
  | "Staff"
  | "Team Leader"
  | "Co-Investigator"
  | "Principal Investigator"
  | "Alternate Contact";
export type Remote = number;

export interface PersonSessionLaboratory {
  siteId?: Siteid;
  personUUID?: Personuuid;
  familyName?: Familyname;
  givenName?: Givenname;
  title?: Title;
  emailAddress?: Emailaddress;
  phoneNumber?: Phonenumber;
  login?: Login;
  passwd?: Passwd;
  faxNumber?: Faxnumber;
  externalId?: Externalid;
  cache?: Cache;
  laboratory?: LaboratoryCreate;
  session_options?: PersonSessionOptions;
}
export interface LaboratoryCreate {
  name: LaboratoryName;
  address: Address;
  city: City;
  country: Country;
  url?: URL;
  laboratoryExtPk?: LaboratoryExtPk;
}
export interface PersonSessionOptions {
  role?: Role;
  remote?: Remote;
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function withPersonSessionLaboratory<TBase extends Constructor>(Base: TBase) {
  return class WithPersonSessionLaboratory extends Base {
    siteId?: Siteid;
    personUUID?: Personuuid;
    familyName?: Familyname;
    givenName?: Givenname;
    title?: Title;
    emailAddress?: Emailaddress;
    phoneNumber?: Phonenumber;
    login?: Login;
    passwd?: Passwd;
    faxNumber?: Faxnumber;
    externalId?: Externalid;
    cache?: Cache;
    laboratory?: LaboratoryCreate;
    session_options?: PersonSessionOptions;
  }
}
export function withLaboratoryCreate<TBase extends Constructor>(Base: TBase) {
  return class WithLaboratoryCreate extends Base {
    name: LaboratoryName;
    address: Address;
    city: City;
    country: Country;
    url?: URL;
    laboratoryExtPk?: LaboratoryExtPk;
  }
}
export function withPersonSessionOptions<TBase extends Constructor>(Base: TBase) {
  return class WithPersonSessionOptions extends Base {
    role?: Role;
    remote?: Remote;
  }
}
