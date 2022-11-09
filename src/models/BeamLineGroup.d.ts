/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type GroupName = string;
/**
 * Display type to use in the UI
 */
export type UIGroup = string;
/**
 * Permission required to view all proposals from these beamlines
 */
export type Permission = string;
export type BeamlineName = string;
export type SampleChangerType = null | string;
/**
 * If no specific type is available a capacity can be defined for the generic view
 */
export type SampleChangerCapacity = null | number;
/**
 * Whether this beamline is archived (no longer displayed on landing page)
 */
export type Archived = boolean;
export type Beamlines = BeamLineGroupBeamLine[];

export interface BeamLineGroup {
  groupName: GroupName;
  uiGroup: UIGroup;
  permission: Permission;
  beamLines?: Beamlines;
}
export interface BeamLineGroupBeamLine {
  beamLineName: BeamlineName;
  sampleChangerType?: SampleChangerType;
  sampleChangerCapacity?: SampleChangerCapacity;
  archived?: Archived;
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function withBeamLineGroup<TBase extends Constructor>(Base: TBase) {
  return class WithBeamLineGroup extends Base {
    groupName: GroupName;
    uiGroup: UIGroup;
    permission: Permission;
    beamLines?: Beamlines;
  }
}
export function withBeamLineGroupBeamLine<TBase extends Constructor>(Base: TBase) {
  return class WithBeamLineGroupBeamLine extends Base {
    beamLineName: BeamlineName;
    sampleChangerType?: SampleChangerType;
    sampleChangerCapacity?: SampleChangerCapacity;
    archived?: Archived;
  }
}
