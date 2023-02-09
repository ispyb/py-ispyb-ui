import { Entity } from '@rest-hooks/rest';
import { SingletonEntity } from 'api/resources/Base/Singleton';

/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Xrffluorescencemappingid = number;
export type Colourmap = string;
export type Opacity = number;
export type Points = number;
export type Dataformat = string;
/**
 * Url to map image
 */
export type Url = string;
export type Blsubsampleid = number;
export type Blsampleid = number;
export type Datacollectionid = number;
export type Gridinfoid = number;
export type StepsX = number;
export type StepsY = number;
export type Snaked = boolean;
export type Orientation = string;
export type Xrffluorescencemappingroiid = number;
export type Element = string;
export type Edge = string;
export type Scalar = string;
export type Startenergy = number;
export type Endenergy = number;

export interface Map {
  xrfFluorescenceMappingId: Xrffluorescencemappingid;
  colourMap?: Colourmap;
  opacity?: Opacity;
  points?: Points;
  dataFormat: Dataformat;
  _metadata: MapMetaData;
  GridInfo: MapGridInfo;
  XRFFluorescenceMappingROI: MapROI;
}
export interface MapMetaData {
  url: Url;
  blSubSampleId?: Blsubsampleid;
  blSampleId?: Blsampleid;
  dataCollectionId?: Datacollectionid;
}
export interface MapGridInfo {
  gridInfoId: Gridinfoid;
  steps_x: StepsX;
  steps_y: StepsY;
  snaked: Snaked;
  orientation: Orientation;
}
export interface MapROI {
  xrfFluorescenceMappingROIId: Xrffluorescencemappingroiid;
  element?: Element;
  edge?: Edge;
  scalar?: Scalar;
  startEnergy: Startenergy;
  endEnergy: Endenergy;
}


export abstract class MapBase extends Entity {
  xrfFluorescenceMappingId: Xrffluorescencemappingid;
  colourMap?: Colourmap;
  opacity?: Opacity;
  points?: Points;
  dataFormat: Dataformat;
  _metadata: MapMetaData;
  GridInfo: MapGridInfo;
  XRFFluorescenceMappingROI: MapROI;
}

export abstract class MapSingletonBase extends SingletonEntity {
  xrfFluorescenceMappingId: Xrffluorescencemappingid;
  colourMap?: Colourmap;
  opacity?: Opacity;
  points?: Points;
  dataFormat: Dataformat;
  _metadata: MapMetaData;
  GridInfo: MapGridInfo;
  XRFFluorescenceMappingROI: MapROI;
}

export abstract class MapMetaDataBase extends Entity {
  url: Url;
  blSubSampleId?: Blsubsampleid;
  blSampleId?: Blsampleid;
  dataCollectionId?: Datacollectionid;
}

export abstract class MapMetaDataSingletonBase extends SingletonEntity {
  url: Url;
  blSubSampleId?: Blsubsampleid;
  blSampleId?: Blsampleid;
  dataCollectionId?: Datacollectionid;
}

export abstract class MapGridInfoBase extends Entity {
  gridInfoId: Gridinfoid;
  steps_x: StepsX;
  steps_y: StepsY;
  snaked: Snaked;
  orientation: Orientation;
}

export abstract class MapGridInfoSingletonBase extends SingletonEntity {
  gridInfoId: Gridinfoid;
  steps_x: StepsX;
  steps_y: StepsY;
  snaked: Snaked;
  orientation: Orientation;
}

export abstract class MapROIBase extends Entity {
  xrfFluorescenceMappingROIId: Xrffluorescencemappingroiid;
  element?: Element;
  edge?: Edge;
  scalar?: Scalar;
  startEnergy: Startenergy;
  endEnergy: Endenergy;
}

export abstract class MapROISingletonBase extends SingletonEntity {
  xrfFluorescenceMappingROIId: Xrffluorescencemappingroiid;
  element?: Element;
  edge?: Edge;
  scalar?: Scalar;
  startEnergy: Startenergy;
  endEnergy: Endenergy;
}

