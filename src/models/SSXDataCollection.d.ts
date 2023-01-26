/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Datacollectionid = number;
export type Repetitionrate = number;
export type Energybandwidth = number;
export type Monostripe = string;
export type Jetspeed = number;
export type Jetsize = number;
export type Chippattern = string;
export type Chipmodel = string;
export type Reactionduration = number;
export type Laserenergy = number;
export type Experimentname = string;

export interface SSXDataCollection {
  dataCollectionId: Datacollectionid;
  repetitionRate?: Repetitionrate;
  energyBandwidth?: Energybandwidth;
  monoStripe?: Monostripe;
  jetSpeed?: Jetspeed;
  jetSize?: Jetsize;
  chipPattern?: Chippattern;
  chipModel?: Chipmodel;
  reactionDuration?: Reactionduration;
  laserEnergy?: Laserenergy;
  experimentName?: Experimentname;
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function withSSXDataCollection<TBase extends Constructor>(Base: TBase) {
  return class WithSSXDataCollection extends Base {
    dataCollectionId: Datacollectionid;
    repetitionRate?: Repetitionrate;
    energyBandwidth?: Energybandwidth;
    monoStripe?: Monostripe;
    jetSpeed?: Jetspeed;
    jetSize?: Jetsize;
    chipPattern?: Chippattern;
    chipModel?: Chipmodel;
    reactionDuration?: Reactionduration;
    laserEnergy?: Laserenergy;
    experimentName?: Experimentname;
  }
}