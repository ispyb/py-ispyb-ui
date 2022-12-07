import { useAxisSystemContext } from '@h5web/lib';
import { computeResolution, getRingCanvasRadii } from '../utils';
import type { BraggyHeader } from '../models';
import BeamCenter from './BeamCenter';
import ResolutionRings from './ResolutionRings';
import { useVisClipping } from './hooks';
import { Vector3 } from 'three';

interface Props {
  braggyHeader: BraggyHeader;
  ringColor: string;
}

const Z_POSITION = 1; // Ensures that the rings are always rendered in front of the heatmap mesh placed at z=0

function ResolutionOverlay(props: Props) {
  const { braggyHeader, ringColor } = props;
  const {
    pixel_size_x,
    pixel_size_y,
    img_width,
    img_height,
    beam_ocx,
    beam_ocy,
    wavelength,
    detector_distance,
  } = braggyHeader;

  const { visSize } = useAxisSystemContext();
  const { width, height } = visSize;

  useVisClipping();

  const realToCanvasRatio =
    Math.sqrt(width ** 2 + height ** 2) /
    Math.sqrt(
      (img_width * pixel_size_x) ** 2 + (img_height * pixel_size_y) ** 2
    );

  const beamCenterCoords = new Vector3(
    -(beam_ocx / img_width) * width,
    (beam_ocy / img_height) * height,
    Z_POSITION
  );

  const maxCanvasRadius = Math.max(
    width / 2 + Math.abs(beamCenterCoords.x),
    height / 2 + Math.abs(beamCenterCoords.y)
  );
  const canvasRadii = getRingCanvasRadii(maxCanvasRadius);

  const ringParams = canvasRadii.map((radius) => {
    return {
      radius,
      resolution: computeResolution(
        radius / realToCanvasRatio,
        wavelength,
        detector_distance
      ),
    };
  });

  return (
    <group position={beamCenterCoords}>
      <ResolutionRings
        color={ringColor}
        ringParams={ringParams}
        beamCenterCoords={beamCenterCoords}
      />
      <BeamCenter />
    </group>
  );
}

export default ResolutionOverlay;
