import { format } from 'd3-format';
import { clamp, range } from 'lodash';
import type { BraggyHeader } from './models';

export function getRingCanvasRadii(maxRadius: number): number[] {
  const numRings = clamp(3 + Math.round((4 * (maxRadius - 100)) / 600), 3, 7);

  return range(0.99 * maxRadius, 0, -maxRadius / numRings);
}

export function getRealRadius(
  x: number,
  y: number,
  braggyHeader: BraggyHeader
): number {
  const {
    img_width,
    img_height,
    beam_ocx,
    pixel_size_x,
    beam_ocy,
    pixel_size_y,
  } = braggyHeader;

  const dx = (x - img_width / 2 + beam_ocx) * pixel_size_x;
  const dy = (y - img_height / 2 + beam_ocy) * pixel_size_y;

  return Math.sqrt(dx * dx + dy * dy);
}

export function computeResolution(
  realRadius: number,
  wavelength: number,
  detector_distance: number
) {
  return (
    (0.5 * wavelength) /
    Math.sin(0.5 * Math.atan2(realRadius, detector_distance))
  );
}

export const formatTooltipVal = format('.5~g');
export const formatRealValue = format('.2f');

export const ZOOM_KEY = 'Shift';
export const LINE_PROFILE_KEY = 'Control';
export const CIRCLE_PROFILE_KEY = 'Alt';
