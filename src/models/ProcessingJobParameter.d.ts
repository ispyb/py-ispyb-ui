/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Parameterkey = string;
export type Parametervalue = string;

export interface ProcessingJobParameter {
  parameterKey?: Parameterkey;
  parameterValue?: Parametervalue;
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function withProcessingJobParameter<TBase extends Constructor>(Base: TBase) {
  return class WithProcessingJobParameter extends Base {
    parameterKey?: Parameterkey;
    parameterValue?: Parametervalue;
  }
}
