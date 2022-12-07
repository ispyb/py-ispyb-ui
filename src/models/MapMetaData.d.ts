/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Url to map image
 */
export type Url = string;

export interface MapMetaData {
  url: Url;
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function withMapMetaData<TBase extends Constructor>(Base: TBase) {
  return class WithMapMetaData extends Base {
    url: Url;
  }
}
