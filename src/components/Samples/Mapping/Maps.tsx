import React, { useState, useEffect } from 'react';
import { useController } from 'rest-hooks';
import { Image as KonvaImage } from 'react-konva';
import { getXHRBlob } from 'api/resources/XHRFile';
import { useAuth } from 'hooks/useAuth';
import { SubSample } from 'models/SubSample';
import { Map } from 'models/Map';

export default function Maps({
  maps,
  subsamples,
  showHidden,
  selectedROI,
}: {
  maps: Map[];
  subsamples: SubSample[];
  showHidden: boolean;
  selectedROI: number;
}) {
  const { site } = useAuth();
  const { fetch } = useController();
  const [mapsLoaded, setMapsLoaded] = useState<boolean>(false);
  const [preMaps, setPreMaps] = useState<Record<string, any>>({});

  useEffect(() => {
    setMapsLoaded(false);
    setPreMaps([]);

    async function getMaps() {
      const preMaps = {};
      for (const map of maps) {
        if (
          map.XRFFluorescenceMappingROI.xrfFluorescenceMappingROIId !==
          selectedROI
        )
          continue;

        if (!(map.opacity || showHidden)) continue;

        const imageData = await fetch(getXHRBlob, {
          src: `${site.host}${map._metadata.url}`,
        });
        console.log('loaded map', imageData);
        // @ts-expect-error
        preMaps[`${map.xrfFluorescenceMappingId}`] = imageData;
      }
      setPreMaps(preMaps);
    }
    getMaps();
    console.log('maps loaded');

    setMapsLoaded(true);
  }, [maps, fetch, site.host, selectedROI, showHidden]);

  return (
    <>
      {mapsLoaded && (
        <>
          {Object.entries(preMaps).map(([mapId, blob]) => {
            const map = maps.filter(
              (map) => map.xrfFluorescenceMappingId === parseInt(mapId)
            )[0];
            const subsample = subsamples.filter(
              (subsample) =>
                subsample.blSubSampleId === map._metadata.blSubSampleId
            )[0];
            console.log('render map', map, mapId);
            const imageElement = new Image();
            imageElement.src = blob;

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
              />
            );
          })}
        </>
      )}
    </>
  );
}
