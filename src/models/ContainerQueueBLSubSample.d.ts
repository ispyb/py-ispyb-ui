/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Type = string;
export type Blsampleid = number;
export type Name = string;

export interface ContainerQueueBLSubSample {
  type: Type;
  BLSample: ContainerQueueBLSample;
}
export interface ContainerQueueBLSample {
  blSampleId: Blsampleid;
  name: Name;
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function withContainerQueueBLSubSample<TBase extends Constructor>(Base: TBase) {
  return class WithContainerQueueBLSubSample extends Base {
    type: Type;
    BLSample: ContainerQueueBLSample;
  }
}
export function withContainerQueueBLSample<TBase extends Constructor>(Base: TBase) {
  return class WithContainerQueueBLSample extends Base {
    blSampleId: Blsampleid;
    name: Name;
  }
}
