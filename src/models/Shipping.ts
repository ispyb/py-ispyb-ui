import { Entity } from '@rest-hooks/rest';
import { SingletonEntity } from 'api/resources/Base/Singleton';

/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Proposalid = number;
export type Name = string;
export type SendingLabContact = number;
export type ReturnLabContact = number;
export type SafetyLevel = SafetyLevelEnum;
/**
 * An enumeration.
 */
export type SafetyLevelEnum = "GREEN" | "YELLOW" | "RED";
export type Comments = string;
export type Shippingid = number;
export type CreatedAt = string;
/**
 * Number of dewars
 */
export type Dewars = number;
export type ReturnLabContact1 = ShippingLabContact;
export type Cardname = string;
export type Givenname = string;
export type Familyname = string;
export type SendingLabContact1 = ShippingLabContact;

export interface Shipping {
  proposalId: Proposalid;
  shippingName: Name;
  sendingLabContactId?: SendingLabContact;
  returnLabContactId?: ReturnLabContact;
  safetyLevel?: SafetyLevel;
  comments?: Comments;
  shippingId: Shippingid;
  bltimeStamp?: CreatedAt;
  _metadata?: ShippingMetaData;
  LabContact?: ReturnLabContact1;
  LabContact1?: SendingLabContact1;
}
export interface ShippingMetaData {
  dewars: Dewars;
}
export interface ShippingLabContact {
  cardName: Cardname;
  Person: ShippingLabContactPerson;
}
export interface ShippingLabContactPerson {
  givenName: Givenname;
  familyName: Familyname;
}


export abstract class ShippingBase extends Entity {
  proposalId: Proposalid;
  shippingName: Name;
  sendingLabContactId?: SendingLabContact;
  returnLabContactId?: ReturnLabContact;
  safetyLevel?: SafetyLevel;
  comments?: Comments;
  shippingId: Shippingid;
  bltimeStamp?: CreatedAt;
  _metadata?: ShippingMetaData;
  LabContact?: ReturnLabContact1;
  LabContact1?: SendingLabContact1;
}

export abstract class ShippingSingletonBase extends SingletonEntity {
  proposalId: Proposalid;
  shippingName: Name;
  sendingLabContactId?: SendingLabContact;
  returnLabContactId?: ReturnLabContact;
  safetyLevel?: SafetyLevel;
  comments?: Comments;
  shippingId: Shippingid;
  bltimeStamp?: CreatedAt;
  _metadata?: ShippingMetaData;
  LabContact?: ReturnLabContact1;
  LabContact1?: SendingLabContact1;
}

export abstract class ShippingMetaDataBase extends Entity {
  dewars: Dewars;
}

export abstract class ShippingMetaDataSingletonBase extends SingletonEntity {
  dewars: Dewars;
}

export abstract class ShippingLabContactBase extends Entity {
  cardName: Cardname;
  Person: ShippingLabContactPerson;
}

export abstract class ShippingLabContactSingletonBase extends SingletonEntity {
  cardName: Cardname;
  Person: ShippingLabContactPerson;
}

export abstract class ShippingLabContactPersonBase extends Entity {
  givenName: Givenname;
  familyName: Familyname;
}

export abstract class ShippingLabContactPersonSingletonBase extends SingletonEntity {
  givenName: Givenname;
  familyName: Familyname;
}
