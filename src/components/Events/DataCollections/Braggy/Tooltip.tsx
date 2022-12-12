import type { BraggyHeader } from './models';
import {
  computeResolution,
  formatRealValue,
  formatTooltipVal,
  getRealRadius,
} from './utils';
import styles from './Tooltip.module.css';

interface Props {
  xIndex: number;
  yIndex: number;
  value: number;
  braggyHeader: BraggyHeader;
}

function Tooltip(props: Props) {
  const { xIndex, yIndex, value, braggyHeader } = props;
  const { wavelength, detector_distance } = braggyHeader;

  const realRadius = getRealRadius(xIndex, yIndex, braggyHeader);
  const resolution = computeResolution(
    realRadius,
    wavelength,
    detector_distance
  );
  return (
    <>
      {`x=${xIndex}, y=${yIndex}`}
      <div className={styles.tooltipValue}>
        {`Intensity: ${formatTooltipVal(value)}`}
      </div>
      <div className={styles.tooltipValue}>
        {`Radius: ${formatRealValue(realRadius * 1000)} mm `}
        {`(${formatRealValue(resolution)} Å)`}
      </div>
    </>
  );
}

export default Tooltip;
