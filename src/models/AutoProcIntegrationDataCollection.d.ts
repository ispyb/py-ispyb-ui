/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Xbeam = number;
export type Ybeam = number;

export interface AutoProcIntegrationDataCollection {
  xBeam?: Xbeam;
  yBeam?: Ybeam;
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function withAutoProcIntegrationDataCollection<TBase extends Constructor>(Base: TBase) {
  return class WithAutoProcIntegrationDataCollection extends Base {
    xBeam?: Xbeam;
    yBeam?: Ybeam;
  }
}
