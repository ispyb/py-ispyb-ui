/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Sessionid = number;
export type Datacollectiongroupid = number;
export type Exposuretime = number;
export type Transmission = number;
export type Flux = number;
export type Xbeam = number;
export type Ybeam = number;
export type Wavelength = number;
export type Detectordistance = number;
export type Beamsizeatsamplex = number;
export type Beamsizeatsampley = number;
export type Averagetemperature = number;
export type Xtalsnapshotfullpath1 = string;
export type Xtalsnapshotfullpath2 = string;
export type Xtalsnapshotfullpath3 = string;
export type Xtalsnapshotfullpath4 = string;
export type Imageprefix = string;
export type Numberofpasses = number;
export type Numberofimages = number;
export type Resolution = number;
export type Resolutionatcorner = number;
export type FluxEnd = number;
export type Detectorid = number;
export type Starttime = string;
export type Endtime = string;
export type Repetitionrate = number;
export type Energybandwidth = number;
export type Monostripe = string;
export type Experimentname = string;
export type Name = string;
export type Type = "XrayDetection" | "XrayExposure" | "LaserExcitation" | "ReactionTrigger";
export type Name1 = string;
export type Offset = number;
export type Duration = number;
export type Period = number;
export type Repetition = number;
export type Events = EventCreate[];
export type EventChains = EventChainCreate[];

export interface SSXDataCollectionCreate {
  sessionId: Sessionid;
  dataCollectionGroupId: Datacollectiongroupid;
  exposureTime?: Exposuretime;
  transmission?: Transmission;
  flux?: Flux;
  xBeam?: Xbeam;
  yBeam?: Ybeam;
  wavelength?: Wavelength;
  detectorDistance?: Detectordistance;
  beamSizeAtSampleX?: Beamsizeatsamplex;
  beamSizeAtSampleY?: Beamsizeatsampley;
  averageTemperature?: Averagetemperature;
  xtalSnapshotFullPath1?: Xtalsnapshotfullpath1;
  xtalSnapshotFullPath2?: Xtalsnapshotfullpath2;
  xtalSnapshotFullPath3?: Xtalsnapshotfullpath3;
  xtalSnapshotFullPath4?: Xtalsnapshotfullpath4;
  imagePrefix?: Imageprefix;
  numberOfPasses?: Numberofpasses;
  numberOfImages?: Numberofimages;
  resolution?: Resolution;
  resolutionAtCorner?: Resolutionatcorner;
  flux_end?: FluxEnd;
  detectorId?: Detectorid;
  startTime: Starttime;
  endTime?: Endtime;
  repetitionRate?: Repetitionrate;
  energyBandwidth?: Energybandwidth;
  monoStripe?: Monostripe;
  experimentName?: Experimentname;
  event_chains: EventChains;
}
export interface EventChainCreate {
  name?: Name;
  events: Events;
}
export interface EventCreate {
  type: Type;
  name?: Name1;
  offset: Offset;
  duration?: Duration;
  period?: Period;
  repetition?: Repetition;
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function withSSXDataCollectionCreate<TBase extends Constructor>(Base: TBase) {
  return class WithSSXDataCollectionCreate extends Base {
    sessionId: Sessionid;
    dataCollectionGroupId: Datacollectiongroupid;
    exposureTime?: Exposuretime;
    transmission?: Transmission;
    flux?: Flux;
    xBeam?: Xbeam;
    yBeam?: Ybeam;
    wavelength?: Wavelength;
    detectorDistance?: Detectordistance;
    beamSizeAtSampleX?: Beamsizeatsamplex;
    beamSizeAtSampleY?: Beamsizeatsampley;
    averageTemperature?: Averagetemperature;
    xtalSnapshotFullPath1?: Xtalsnapshotfullpath1;
    xtalSnapshotFullPath2?: Xtalsnapshotfullpath2;
    xtalSnapshotFullPath3?: Xtalsnapshotfullpath3;
    xtalSnapshotFullPath4?: Xtalsnapshotfullpath4;
    imagePrefix?: Imageprefix;
    numberOfPasses?: Numberofpasses;
    numberOfImages?: Numberofimages;
    resolution?: Resolution;
    resolutionAtCorner?: Resolutionatcorner;
    flux_end?: FluxEnd;
    detectorId?: Detectorid;
    startTime: Starttime;
    endTime?: Endtime;
    repetitionRate?: Repetitionrate;
    energyBandwidth?: Energybandwidth;
    monoStripe?: Monostripe;
    experimentName?: Experimentname;
    event_chains: EventChains;
  }
}
export function withEventChainCreate<TBase extends Constructor>(Base: TBase) {
  return class WithEventChainCreate extends Base {
    name?: Name;
    events: Events;
  }
}
export function withEventCreate<TBase extends Constructor>(Base: TBase) {
  return class WithEventCreate extends Base {
    type: Type;
    name?: Name1;
    offset: Offset;
    duration?: Duration;
    period?: Period;
    repetition?: Repetition;
  }
}
