/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Name = string;
export type Acronym = string;
export type Proteinid = number;

export interface Protein {
  name: Name;
  acronym: Acronym;
  proteinId: Proteinid;
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function withProtein<TBase extends Constructor>(Base: TBase) {
  return class WithProtein extends Base {
    name: Name;
    acronym: Acronym;
    proteinId: Proteinid;
  }
}