import { Entity } from '@rest-hooks/rest';
import { SingletonEntity } from 'api/resources/Base/Singleton';

/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Screeningid = number;
export type Programversion = string;
export type Comments = string;
export type Shortcomments = string;
export type Screeningoutputid = number;
export type Indexingsuccess = number;
export type Strategysuccess = number;
export type Screeningstrategyid = number;
export type Rankingresolution = number;
export type Screeningstrategywedgeid = number;
export type Wedgenumber = number;
export type Resolution = number;
export type Completeness = number;
export type Multiplicity = number;
export type Dosetotal = number;
export type Numberofimages = number;
export type Phi = number;
export type Kappa = number;
export type Chi = number;
export type Comments1 = string;
export type Wavelength = number;
export type Screeningstrategysubwedgeid = number;
export type Subwedgenumber = number;
export type Rotationaxis = string;
export type Axisstart = number;
export type Axisend = number;
export type Exposuretime = number;
export type Transmission = number;
export type Oscillationrange = number;
export type Completeness1 = number;
export type Multiplicity1 = number;
export type Resolution1 = number;
export type Dosetotal1 = number;
export type Numberofimages1 = number;
export type Comments2 = string;
export type Screeningstrategysubwedge = ScreeningStrategySubWedge[];
export type Screeningstrategywedge = ScreeningStrategyWedge[];
export type Screeningstrategy = ScreeningStrategy[];
export type UnitcellA = number;
export type UnitcellB = number;
export type UnitcellC = number;
export type UnitcellAlpha = number;
export type UnitcellBeta = number;
export type UnitcellGamma = number;
export type Spacegroup = string;
export type Pointgroup = string;
export type Screeningoutputlattice = ScreeningOutputLattice[];
export type Screeningoutput = ScreeningOutput[];

export interface Screening {
  screeningId: Screeningid;
  programVersion: Programversion;
  comments?: Comments;
  shortComments?: Shortcomments;
  ScreeningOutput?: Screeningoutput;
}
export interface ScreeningOutput {
  screeningOutputId: Screeningoutputid;
  indexingSuccess: Indexingsuccess;
  strategySuccess: Strategysuccess;
  ScreeningStrategy?: Screeningstrategy;
  ScreeningOutputLattice?: Screeningoutputlattice;
}
export interface ScreeningStrategy {
  screeningStrategyId: Screeningstrategyid;
  rankingResolution?: Rankingresolution;
  ScreeningStrategyWedge?: Screeningstrategywedge;
}
export interface ScreeningStrategyWedge {
  screeningStrategyWedgeId: Screeningstrategywedgeid;
  wedgeNumber?: Wedgenumber;
  resolution?: Resolution;
  completeness?: Completeness;
  multiplicity?: Multiplicity;
  doseTotal?: Dosetotal;
  numberOfImages?: Numberofimages;
  phi?: Phi;
  kappa?: Kappa;
  chi?: Chi;
  comments?: Comments1;
  wavelength?: Wavelength;
  ScreeningStrategySubWedge?: Screeningstrategysubwedge;
}
export interface ScreeningStrategySubWedge {
  screeningStrategySubWedgeId: Screeningstrategysubwedgeid;
  subWedgeNumber?: Subwedgenumber;
  rotationAxis?: Rotationaxis;
  axisStart?: Axisstart;
  axisEnd?: Axisend;
  exposureTime?: Exposuretime;
  transmission?: Transmission;
  oscillationRange?: Oscillationrange;
  completeness?: Completeness1;
  multiplicity?: Multiplicity1;
  RESOLUTION?: Resolution1;
  doseTotal?: Dosetotal1;
  numberOfImages?: Numberofimages1;
  comments?: Comments2;
}
export interface ScreeningOutputLattice {
  unitCell_a: UnitcellA;
  unitCell_b: UnitcellB;
  unitCell_c: UnitcellC;
  unitCell_alpha: UnitcellAlpha;
  unitCell_beta: UnitcellBeta;
  unitCell_gamma: UnitcellGamma;
  spaceGroup?: Spacegroup;
  pointGroup?: Pointgroup;
}


export abstract class ScreeningBase extends Entity {
  screeningId: Screeningid;
  programVersion: Programversion;
  comments?: Comments;
  shortComments?: Shortcomments;
  ScreeningOutput?: Screeningoutput;
}

export abstract class ScreeningSingletonBase extends SingletonEntity {
  screeningId: Screeningid;
  programVersion: Programversion;
  comments?: Comments;
  shortComments?: Shortcomments;
  ScreeningOutput?: Screeningoutput;
}

export abstract class ScreeningOutputBase extends Entity {
  screeningOutputId: Screeningoutputid;
  indexingSuccess: Indexingsuccess;
  strategySuccess: Strategysuccess;
  ScreeningStrategy?: Screeningstrategy;
  ScreeningOutputLattice?: Screeningoutputlattice;
}

export abstract class ScreeningOutputSingletonBase extends SingletonEntity {
  screeningOutputId: Screeningoutputid;
  indexingSuccess: Indexingsuccess;
  strategySuccess: Strategysuccess;
  ScreeningStrategy?: Screeningstrategy;
  ScreeningOutputLattice?: Screeningoutputlattice;
}

export abstract class ScreeningStrategyBase extends Entity {
  screeningStrategyId: Screeningstrategyid;
  rankingResolution?: Rankingresolution;
  ScreeningStrategyWedge?: Screeningstrategywedge;
}

export abstract class ScreeningStrategySingletonBase extends SingletonEntity {
  screeningStrategyId: Screeningstrategyid;
  rankingResolution?: Rankingresolution;
  ScreeningStrategyWedge?: Screeningstrategywedge;
}

export abstract class ScreeningStrategyWedgeBase extends Entity {
  screeningStrategyWedgeId: Screeningstrategywedgeid;
  wedgeNumber?: Wedgenumber;
  resolution?: Resolution;
  completeness?: Completeness;
  multiplicity?: Multiplicity;
  doseTotal?: Dosetotal;
  numberOfImages?: Numberofimages;
  phi?: Phi;
  kappa?: Kappa;
  chi?: Chi;
  comments?: Comments1;
  wavelength?: Wavelength;
  ScreeningStrategySubWedge?: Screeningstrategysubwedge;
}

export abstract class ScreeningStrategyWedgeSingletonBase extends SingletonEntity {
  screeningStrategyWedgeId: Screeningstrategywedgeid;
  wedgeNumber?: Wedgenumber;
  resolution?: Resolution;
  completeness?: Completeness;
  multiplicity?: Multiplicity;
  doseTotal?: Dosetotal;
  numberOfImages?: Numberofimages;
  phi?: Phi;
  kappa?: Kappa;
  chi?: Chi;
  comments?: Comments1;
  wavelength?: Wavelength;
  ScreeningStrategySubWedge?: Screeningstrategysubwedge;
}

export abstract class ScreeningStrategySubWedgeBase extends Entity {
  screeningStrategySubWedgeId: Screeningstrategysubwedgeid;
  subWedgeNumber?: Subwedgenumber;
  rotationAxis?: Rotationaxis;
  axisStart?: Axisstart;
  axisEnd?: Axisend;
  exposureTime?: Exposuretime;
  transmission?: Transmission;
  oscillationRange?: Oscillationrange;
  completeness?: Completeness1;
  multiplicity?: Multiplicity1;
  RESOLUTION?: Resolution1;
  doseTotal?: Dosetotal1;
  numberOfImages?: Numberofimages1;
  comments?: Comments2;
}

export abstract class ScreeningStrategySubWedgeSingletonBase extends SingletonEntity {
  screeningStrategySubWedgeId: Screeningstrategysubwedgeid;
  subWedgeNumber?: Subwedgenumber;
  rotationAxis?: Rotationaxis;
  axisStart?: Axisstart;
  axisEnd?: Axisend;
  exposureTime?: Exposuretime;
  transmission?: Transmission;
  oscillationRange?: Oscillationrange;
  completeness?: Completeness1;
  multiplicity?: Multiplicity1;
  RESOLUTION?: Resolution1;
  doseTotal?: Dosetotal1;
  numberOfImages?: Numberofimages1;
  comments?: Comments2;
}

export abstract class ScreeningOutputLatticeBase extends Entity {
  unitCell_a: UnitcellA;
  unitCell_b: UnitcellB;
  unitCell_c: UnitcellC;
  unitCell_alpha: UnitcellAlpha;
  unitCell_beta: UnitcellBeta;
  unitCell_gamma: UnitcellGamma;
  spaceGroup?: Spacegroup;
  pointGroup?: Pointgroup;
}

export abstract class ScreeningOutputLatticeSingletonBase extends SingletonEntity {
  unitCell_a: UnitcellA;
  unitCell_b: UnitcellB;
  unitCell_c: UnitcellC;
  unitCell_alpha: UnitcellAlpha;
  unitCell_beta: UnitcellBeta;
  unitCell_gamma: UnitcellGamma;
  spaceGroup?: Spacegroup;
  pointGroup?: Pointgroup;
}

