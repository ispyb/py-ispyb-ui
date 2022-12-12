import type { Domain } from '@h5web/lib';
import { HeatmapVis } from '@h5web/lib';
import '@h5web/lib/dist/styles.css';
import ndarray from 'ndarray';
import { useContext } from 'react';
import { ConfigContext, IConfigContext } from './configContext';
import type { BraggyHeader } from './models';
import styles from './ImageView.module.scss';

import ResolutionOverlay from './rings/ResolutionOverlay';
import Tooltip from './Tooltip';
import { ZOOM_KEY } from './utils';
import { useImageData } from 'hooks/useImageData';

export interface Props {
  imageNumber: number;
  safeDomain: Domain;
  progress: (progress: number) => void;
  dataCollectionId?: string;
}

export default function ImageView(props: Props) {
  const { imageNumber, dataCollectionId, progress, safeDomain } = props;
  const { imageData, imageHeader } = useImageData({
    imageNumber,
    dataCollectionId,
    progress,
    loadData: true,
  });

  const { img_height, img_width } = imageHeader.braggy_hdr as BraggyHeader;

  const { scaleType, colorMap, invertColorMap, showGrid, showRings } =
    useContext(ConfigContext) as IConfigContext;

  const ringColor = '#000';

  const dataArray = ndarray(new Float32Array(imageData), [
    img_height,
    img_width,
  ]);

  return (
    <div className={styles.heatmapContainer}>
      <HeatmapVis
        dataArray={dataArray}
        domain={safeDomain}
        scaleType={scaleType}
        colorMap={colorMap}
        invertColorMap={invertColorMap}
        showGrid={showGrid}
        renderTooltip={({ xi, yi }) => (
          <Tooltip
            xIndex={xi}
            yIndex={yi}
            value={dataArray.get(yi, xi)}
            braggyHeader={imageHeader.braggy_hdr}
          />
        )}
        flipYAxis
        interactions={{ selectToZoom: { modifierKey: ZOOM_KEY } }}
      >
        {showRings && (
          <ResolutionOverlay
            ringColor={ringColor}
            braggyHeader={imageHeader.braggy_hdr}
          />
        )}
      </HeatmapVis>
    </div>
  );
}
