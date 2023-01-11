/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Blsampleid = number;
export type Name = string;
export type Comments = null | string;
/**
 * Location in container
 */
export type Location = number;
export type Containerid = number;
export type Crystalid = number;
export type Proteinid = number;
export type CellA = number;
export type CellB = number;
export type CellC = number;
export type CellAlpha = number;
export type CellBeta = number;
export type CellGamma = number;
export type SizeX = number;
export type SizeY = number;
export type SizeZ = number;
export type Componentid = number;
export type Name1 = string;
export type Composition = null | string;
export type Name2 = string;
export type Abundance = null | number;
export type Ratio = null | number;
export type PH = null | number;
export type CrystalCompositions = CompositionCreateUpdate[];
export type SampleCompositions = CompositionCreateUpdate[];
export type SampleSupport = null | string;

export interface SampleCreateUpdate {
  blSampleId?: Blsampleid;
  name: Name;
  comments?: Comments;
  location?: Location;
  containerId?: Containerid;
  Crystal: SampleCrystalCreateUpdate;
  sample_compositions?: SampleCompositions;
  loopType?: SampleSupport;
}
export interface SampleCrystalCreateUpdate {
  crystalId?: Crystalid;
  Protein: CrystalProteinCreate;
  cell_a?: CellA;
  cell_b?: CellB;
  cell_c?: CellC;
  cell_alpha?: CellAlpha;
  cell_beta?: CellBeta;
  cell_gamma?: CellGamma;
  size_X?: SizeX;
  size_Y?: SizeY;
  size_Z?: SizeZ;
  crystal_compositions?: CrystalCompositions;
}
export interface CrystalProteinCreate {
  proteinId: Proteinid;
}
export interface CompositionCreateUpdate {
  Component: ComponentCreateUpdate;
  abundance?: Abundance;
  ratio?: Ratio;
  ph?: PH;
}
export interface ComponentCreateUpdate {
  componentId?: Componentid;
  name: Name1;
  composition?: Composition;
  ComponentType: ComponentType;
}
export interface ComponentType {
  name: Name2;
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function withSampleCreateUpdate<TBase extends Constructor>(Base: TBase) {
  return class WithSampleCreateUpdate extends Base {
    blSampleId?: Blsampleid;
    name: Name;
    comments?: Comments;
    location?: Location;
    containerId?: Containerid;
    Crystal: SampleCrystalCreateUpdate;
    sample_compositions?: SampleCompositions;
    loopType?: SampleSupport;
  }
}
export function withSampleCrystalCreateUpdate<TBase extends Constructor>(Base: TBase) {
  return class WithSampleCrystalCreateUpdate extends Base {
    crystalId?: Crystalid;
    Protein: CrystalProteinCreate;
    cell_a?: CellA;
    cell_b?: CellB;
    cell_c?: CellC;
    cell_alpha?: CellAlpha;
    cell_beta?: CellBeta;
    cell_gamma?: CellGamma;
    size_X?: SizeX;
    size_Y?: SizeY;
    size_Z?: SizeZ;
    crystal_compositions?: CrystalCompositions;
  }
}
export function withCrystalProteinCreate<TBase extends Constructor>(Base: TBase) {
  return class WithCrystalProteinCreate extends Base {
    proteinId: Proteinid;
  }
}
export function withCompositionCreateUpdate<TBase extends Constructor>(Base: TBase) {
  return class WithCompositionCreateUpdate extends Base {
    Component: ComponentCreateUpdate;
    abundance?: Abundance;
    ratio?: Ratio;
    ph?: PH;
  }
}
export function withComponentCreateUpdate<TBase extends Constructor>(Base: TBase) {
  return class WithComponentCreateUpdate extends Base {
    componentId?: Componentid;
    name: Name1;
    composition?: Composition;
    ComponentType: ComponentType;
  }
}
export function withComponentType<TBase extends Constructor>(Base: TBase) {
  return class WithComponentType extends Base {
    name: Name2;
  }
}
