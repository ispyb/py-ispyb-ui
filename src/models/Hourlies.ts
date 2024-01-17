import { Entity } from '@rest-hooks/rest';
import { SingletonEntity } from 'api/resources/Base/Singleton';

/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Hour = number[];
export type Average = number[];

export interface Hourlies {
  datacollections: Hourly;
  loaded: Hourly;
}
export interface Hourly {
  hour: Hour;
  average: Average;
}


export abstract class HourliesBase extends Entity {
  datacollections: Hourly;
  loaded: Hourly;
}

export abstract class HourliesSingletonBase extends SingletonEntity {
  datacollections: Hourly;
  loaded: Hourly;
}

export abstract class HourlyBase extends Entity {
  hour: Hour;
  average: Average;
}

export abstract class HourlySingletonBase extends SingletonEntity {
  hour: Hour;
  average: Average;
}
