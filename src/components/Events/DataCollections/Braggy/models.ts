export interface ValidationErrors {
  errorMessage: string;
  field_errors: Record<string, string>;
}

export interface Entry {
  ext: string;
  name: string;
  path: string;
  type: string;
  last_modified: number;
}

export interface BraggyHeader {
  img_height: number;
  img_width: number;
  pixel_size_x: number;
  pixel_size_y: number;
  min: number;
  positive_min: number;
  strict_positive_min: number;
  max: number;
  mean: number;
  std: number;
  wavelength: number;
  detector_distance: number;
  beam_ocx: number;
  beam_ocy: number;
}

export interface BraggyMetadata extends Entry {
  hdr: { braggy_hdr: BraggyHeader };
}

export interface HistMetadata {
  bins: number[];
  shape: number[];
  max: number;
}

export interface Histogram extends HistMetadata {
  values: number[];
}

export interface BraggyFile extends BraggyMetadata {
  data: Float32Array;
  histogram: Histogram;
}
