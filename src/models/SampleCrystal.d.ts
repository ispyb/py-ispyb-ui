/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type CellA = null | number;
export type CellB = null | number;
export type CellC = null | number;
export type CellAlpha = null | number;
export type CellBeta = null | number;
export type CellGamma = null | number;
export type Protein = SampleProtein;
export type Proposalid = string;
export type Name = string;
export type Acronym = string;
export type Proteinid = number;
export type SizeX = number;
export type SizeY = number;
export type SizeZ = number;
export type Abundance = number;
export type Crystalid = number;
export type Protein1 = number;
export type Componentid = number;
export type Name1 = string;
export type Composition1 = null | string;
export type Name2 = string;
export type Componentid1 = number;
export type Abundance1 = null | number;
export type Ratio = null | number;
export type PH = null | number;
export type CrystalCompositions = Composition[];

export interface SampleCrystal {
  cell_a?: CellA;
  cell_b?: CellB;
  cell_c?: CellC;
  cell_alpha?: CellAlpha;
  cell_beta?: CellBeta;
  cell_gamma?: CellGamma;
  Protein: Protein;
  size_X?: SizeX;
  size_Y?: SizeY;
  size_Z?: SizeZ;
  abundance?: Abundance;
  crystalId: Crystalid;
  proteinId: Protein1;
  crystal_compositions?: CrystalCompositions;
}
export interface SampleProtein {
  proposalId: Proposalid;
  name: Name;
  acronym: Acronym;
  proteinId: Proteinid;
}
export interface Composition {
  Component: Component;
  componentId: Componentid1;
  abundance?: Abundance1;
  ratio?: Ratio;
  ph?: PH;
}
export interface Component {
  componentId: Componentid;
  name: Name1;
  composition?: Composition1;
  ComponentType: ComponentType;
}
export interface ComponentType {
  name: Name2;
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function withSampleCrystal<TBase extends Constructor>(Base: TBase) {
  return class WithSampleCrystal extends Base {
    cell_a?: CellA;
    cell_b?: CellB;
    cell_c?: CellC;
    cell_alpha?: CellAlpha;
    cell_beta?: CellBeta;
    cell_gamma?: CellGamma;
    Protein: Protein;
    size_X?: SizeX;
    size_Y?: SizeY;
    size_Z?: SizeZ;
    abundance?: Abundance;
    crystalId: Crystalid;
    proteinId: Protein1;
    crystal_compositions?: CrystalCompositions;
  }
}
export function withSampleProtein<TBase extends Constructor>(Base: TBase) {
  return class WithSampleProtein extends Base {
    proposalId: Proposalid;
    name: Name;
    acronym: Acronym;
    proteinId: Proteinid;
  }
}
export function withComposition<TBase extends Constructor>(Base: TBase) {
  return class WithComposition extends Base {
    Component: Component;
    componentId: Componentid1;
    abundance?: Abundance1;
    ratio?: Ratio;
    ph?: PH;
  }
}
export function withComponent<TBase extends Constructor>(Base: TBase) {
  return class WithComponent extends Base {
    componentId: Componentid;
    name: Name1;
    composition?: Composition1;
    ComponentType: ComponentType;
  }
}
export function withComponentType<TBase extends Constructor>(Base: TBase) {
  return class WithComponentType extends Base {
    name: Name2;
  }
}
