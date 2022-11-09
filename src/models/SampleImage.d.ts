/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Blsampleimageid = number;
export type Blsampleid = number;
export type Micronsperpixelx = number;
export type Micronsperpixely = number;
export type Offsetx = number;
export type Offsety = number;
/**
 * Url to sample image
 */
export type Url = string;

export interface SampleImage {
  blSampleImageId: Blsampleimageid;
  blSampleId: Blsampleid;
  micronsPerPixelX: Micronsperpixelx;
  micronsPerPixelY: Micronsperpixely;
  offsetX: Offsetx;
  offsetY: Offsety;
  _metadata: SampleImageMetaData;
}
export interface SampleImageMetaData {
  url: Url;
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function withSampleImage<TBase extends Constructor>(Base: TBase) {
  return class WithSampleImage extends Base {
    blSampleImageId: Blsampleimageid;
    blSampleId: Blsampleid;
    micronsPerPixelX: Micronsperpixelx;
    micronsPerPixelY: Micronsperpixely;
    offsetX: Offsetx;
    offsetY: Offsety;
    _metadata: SampleImageMetaData;
  }
}
export function withSampleImageMetaData<TBase extends Constructor>(Base: TBase) {
  return class WithSampleImageMetaData extends Base {
    url: Url;
  }
}
