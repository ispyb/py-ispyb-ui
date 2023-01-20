import { useState, useEffect, useCallback } from 'react';
import { useController } from 'rest-hooks';
import { Image as KonvaImage } from 'react-konva';
import { getXHRBlob } from 'api/resources/XHRFile';
import { useAuth } from 'hooks/useAuth';
import { SubSample } from 'models/SubSample';
import { Map } from 'models/Map';
import { awaitImage } from './Images';
import { KonvaEventObject } from 'konva/lib/Node';

export function getROIName(map: any): string {
  return map.XRFFluorescenceMappingROI.scalar
    ? map.XRFFluorescenceMappingROI.scalar
    : `${map.XRFFluorescenceMappingROI.element}-${map.XRFFluorescenceMappingROI.edge}`;
}

export interface SelectPoint {
  dataCollectionId: number;
  selectedPoint: number;
}

export default function Maps({
  maps,
  subsamples,
  showHidden,
  selectedROI,
  mapOpacity,
  setLoadingMessage,
  selectPoint,
  enableCursor,
}: {
  maps: Map[];
  subsamples: SubSample[];
  showHidden: boolean;
  selectedROI: string;
  mapOpacity: number;
  setLoadingMessage: (message: string) => void;
  selectPoint?: (point: SelectPoint) => void;
  enableCursor: boolean;
}) {
  const { site } = useAuth();
  const { fetch } = useController();
  const [mapsLoaded, setMapsLoaded] = useState<boolean>(false);
  const [preMaps, setPreMaps] = useState<Record<string, HTMLImageElement>>({});
  useEffect(() => {
    setMapsLoaded(false);
    setPreMaps({});

    async function getMaps() {
      const preMaps: Record<string, HTMLImageElement> = {};
      let loadedCount = 0;
      const filteredMaps = maps
        .filter((map) => getROIName(map) === selectedROI)
        .filter((map) => map.opacity || showHidden);
      for (const map of filteredMaps) {
        const imageData = await fetch(getXHRBlob, {
          src: `${site.host}${map._metadata.url}`,
        });
        loadedCount++;
        setLoadingMessage(`Loaded ${loadedCount}/${filteredMaps.length} maps`);
        preMaps[`${map.xrfFluorescenceMappingId}`] = await awaitImage(
          imageData
        );
      }
      setPreMaps(preMaps);
      setMapsLoaded(true);
      setLoadingMessage('');
      console.log('maps loaded');
    }
    getMaps();
  }, [maps, fetch, site.host, selectedROI, showHidden, setLoadingMessage]);

  const onClick = useCallback(
    (evt: any) => {
      const rel = evt.target.getRelativePointerPosition();
      const x = Math.floor(rel.x);
      const y = Math.floor(rel.y);

      const filteredMaps = maps.filter(
        (map) =>
          map.xrfFluorescenceMappingId ===
          evt.target.attrs.xrfFluorescenceMappingId
      );
      if (!filteredMaps.length) return;
      const map = filteredMaps[0];

      // point is 1-offset
      const point =
        x + y * (map.GridInfo.steps_x ? map.GridInfo.steps_x : 1) + 1;
      console.log(
        'dataCollectionId',
        map._metadata.dataCollectionId,
        'point',
        point
      );
      if (selectPoint)
        selectPoint({
          dataCollectionId: map._metadata.dataCollectionId,
          selectedPoint: point,
        });
    },
    [maps, selectPoint]
  );

  const setCursor = useCallback(
    (evt: KonvaEventObject<MouseEvent>, pointerType: string = 'default') => {
      if (!enableCursor) return;
      if (evt.target.parent?.parent) {
        // @ts-expect-error
        evt.target.parent.parent.content.style.cursor = pointerType;
      }
    },
    [enableCursor]
  );

  return (
    <>
      {mapsLoaded && (
        <>
          {Object.entries(preMaps).map(([mapId, imageElement]) => {
            const map = maps.filter(
              (map) => map.xrfFluorescenceMappingId === parseInt(mapId)
            )[0];
            if (!map) return null;
            const subsample = subsamples.filter(
              (subsample) =>
                subsample.blSubSampleId === map._metadata.blSubSampleId
            )[0];
            if (!subsample) return null;

            const width =
              (subsample.Position1 &&
                subsample.Position2 &&
                subsample.Position2?.posX - subsample.Position1?.posX) ||
              100000;
            const height =
              (subsample.Position1 &&
                subsample.Position2 &&
                subsample.Position2?.posY - subsample.Position1?.posY) ||
              100000;

            return (
              <KonvaImage
                key={map.xrfFluorescenceMappingId}
                image={imageElement}
                x={subsample.Position1?.posX}
                y={subsample.Position1?.posY}
                scaleX={width / map.GridInfo.steps_x}
                scaleY={height / map.GridInfo.steps_y}
                opacity={mapOpacity / 100}
                onClick={onClick}
                attrs={{
                  xrfFluorescenceMappingId: map.xrfFluorescenceMappingId,
                }}
                onMouseEnter={(evt) => setCursor(evt, 'pointer')}
                onMouseLeave={(evt) => setCursor(evt)}
              />
            );
          })}
        </>
      )}
    </>
  );
}
