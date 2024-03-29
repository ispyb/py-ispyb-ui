/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Id = number;
export type Name = string;
export type Symbol = string;

export interface ConcentrationType {
  concentrationTypeId: Id;
  name: Name;
  symbol: Symbol;
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function withConcentrationType<TBase extends Constructor>(Base: TBase) {
  return class WithConcentrationType extends Base {
    concentrationTypeId: Id;
    name: Name;
    symbol: Symbol;
  }
}
