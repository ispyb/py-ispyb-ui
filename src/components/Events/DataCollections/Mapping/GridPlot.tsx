import { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import { useController, useSuspense } from 'rest-hooks';
import { Form } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import Konva from 'konva';

import { MapResource } from 'api/resources/Map';
import { getXHRBlob } from 'api/resources/XHRFile';
import { useAuth } from 'hooks/useAuth';
import { awaitImage } from 'components/Samples/Mapping/Images';
import { getROIName } from 'components/Samples/Mapping/Maps';
import { GridInfo } from 'models/Event.d';

interface GridPlotProps {
  gridInfo: GridInfo;
  dataCollectionId: number;
  setSelectedPoint?: (point: number) => void;
  snapshotAvailable: boolean;
  snapshotId?: number;
}

function GridPlotMain({
  gridInfo,
  dataCollectionId,
  setSelectedPoint,
  snapshotAvailable,
  snapshotId = 1,
}: GridPlotProps) {
  const { fetch } = useController();
  const { site } = useAuth();

  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const [parentSize, setParentSize] = useState<number[]>([150, 150]);
  const [sampleSnapshot, setSampleSnapshot] = useState<HTMLImageElement>();

  const maps = useSuspense(MapResource.list(), {
    dataCollectionId,
    limit: 9999,
  });

  const [selectedMap, setSelectedMap] = useState<number | undefined>(
    maps.results.length ? maps.results[0].xrfFluorescenceMappingId : undefined
  );
  const [mapImage, setMapImage] = useState<HTMLImageElement>();
  const [selectedPoint, setLocalSelectedPoint] = useState<
    Record<string, number>
  >({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    async function loadMap() {
      const map = maps.results.filter(
        (map) => map.xrfFluorescenceMappingId === selectedMap
      )[0];
      if (!map) return;

      const imageData = await fetch(getXHRBlob, {
        src: site.host + map._metadata.url,
      });
      const image = await awaitImage(imageData);
      setMapImage(image);
    }
    if (maps.results.length) loadMap();
  }, [selectedMap, fetch, maps.results, site.host]);

  useEffect(() => {
    async function loadSnapshot() {
      const imageData = await fetch(getXHRBlob, {
        src: `${site.host}${site.apiPrefix}/datacollections/images/${dataCollectionId}?imageId=${snapshotId}`,
      });
      const image = await awaitImage(imageData);
      setSampleSnapshot(image);
    }
    if (snapshotAvailable) loadSnapshot();
  }, [
    dataCollectionId,
    fetch,
    site.apiPrefix,
    site.host,
    snapshotAvailable,
    snapshotId,
  ]);

  useEffect(() => {
    if (wrapRef.current) {
      const parent = wrapRef.current.parentElement;
      if (parent) setParentSize([parent.clientWidth, parent.clientHeight]);
    }
  }, [wrapRef]);

  const snapshot_offsetXPixel = gridInfo.snapshot_offsetXPixel || 0;
  const snapshot_offsetYPixel = gridInfo.snapshot_offsetYPixel || 0;

  const pixelsPerMicronX = gridInfo.pixelsPerMicronX || 1;
  const pixelsPerMicronY = gridInfo.pixelsPerMicronY || -1;

  const mapWidth =
    gridInfo.steps_x && gridInfo.dx_mm
      ? Math.abs(
          gridInfo.steps_x * (1 / pixelsPerMicronX) * gridInfo.dx_mm * 1e3
        )
      : 1;
  const mapHeight =
    gridInfo.steps_y && gridInfo.dy_mm
      ? Math.abs(
          gridInfo.steps_y * (1 / pixelsPerMicronY) * gridInfo.dy_mm * 1e3
        )
      : 1;

  const zoomStage = useCallback(
    (event: any) => {
      event.evt.preventDefault();
      const delta =
        event.evt.deltaMode === 1 ? event.evt.deltaY * 18 : event.evt.deltaY;
      if (stageRef.current !== null) {
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        // @ts-expect-error
        const { x: pointerX, y: pointerY } = stage.getPointerPosition();
        const mousePointTo = {
          x: (pointerX - stage.x()) / oldScale,
          y: (pointerY - stage.y()) / oldScale,
        };
        const newScale = (-1 * delta) / (400 / oldScale) + oldScale;
        stage.scale({ x: newScale, y: newScale });
        const newPos = {
          x: pointerX - mousePointTo.x * newScale,
          y: pointerY - mousePointTo.y * newScale,
        };
        stage.position(newPos);
        stage.batchDraw();
      }
    },
    [stageRef]
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (stage) {
      const scaleX = parentSize[0] / mapWidth;
      const scaleY = parentSize[1] / mapHeight;
      const scale = scaleX < scaleY ? scaleX : scaleY;
      stage.scale({ x: scale, y: scale });
      stage.position({
        x:
          -snapshot_offsetXPixel * scale +
          (parentSize[0] - mapWidth * scale) / 2,
        y:
          -snapshot_offsetYPixel * scale +
          (parentSize[1] - mapHeight * scale) / 2,
      });
      stage.batchDraw();
    }
  }, [
    stageRef,
    snapshot_offsetXPixel,
    snapshot_offsetYPixel,
    mapHeight,
    mapWidth,
    parentSize,
  ]);

  const selectPoint = useCallback(
    (evt: any) => {
      const rel = evt.target.getRelativePointerPosition();
      const x = Math.floor(rel.x);
      const y = Math.floor(rel.y);

      setLocalSelectedPoint({ x, y });

      // point is 1-offset
      const point = x + y * (gridInfo.steps_x ? gridInfo.steps_x : 1) + 1;
      console.log('point', point);
      if (setSelectedPoint) setSelectedPoint(point);
    },
    [gridInfo.steps_x, setSelectedPoint]
  );

  return (
    <div className="position-relative border border-light ms-2" ref={wrapRef}>
      <div
        className="position-absolute"
        style={{ right: 0, top: 0, zIndex: 100 }}
      >
        {maps.results.length > 0 && (
          <Form.Control
            size="sm"
            as="select"
            onChange={(evt) => setSelectedMap(parseInt(evt.target.value))}
          >
            {maps.results.map((map) => (
              <option
                key={map.xrfFluorescenceMappingId}
                value={map.xrfFluorescenceMappingId}
              >
                {getROIName(map)}
              </option>
            ))}
          </Form.Control>
        )}
      </div>
      <Stage
        key="canvas"
        width={parentSize[0]}
        height={parentSize[1]}
        ref={stageRef}
        draggable
        onWheel={zoomStage}
      >
        <Layer imageSmoothingEnabled={false}>
          {sampleSnapshot && <KonvaImage image={sampleSnapshot} />}
          {mapImage && gridInfo.steps_x && gridInfo.steps_y && (
            <KonvaImage
              opacity={0.7}
              x={snapshot_offsetXPixel}
              y={snapshot_offsetYPixel}
              scaleX={mapWidth / gridInfo.steps_x}
              scaleY={mapHeight / gridInfo.steps_y}
              image={mapImage}
              onClick={selectPoint}
            />
          )}
          {selectedPoint && gridInfo.steps_x && gridInfo.steps_y && (
            <Rect
              opacity={0.7}
              x={
                snapshot_offsetXPixel +
                (mapWidth / gridInfo.steps_x) * selectedPoint.x
              }
              y={
                snapshot_offsetYPixel +
                +((mapHeight / gridInfo.steps_y) * selectedPoint.y)
              }
              width={mapWidth / gridInfo.steps_x}
              height={mapHeight / gridInfo.steps_y}
              fill="red"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

function Loading() {
  return <div className="ms-1 border border-light">Loading...</div>;
}

export default function GridPlot(props: GridPlotProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <>
      {inView && (
        <Suspense fallback={<Loading />}>
          <GridPlotMain {...props} />
        </Suspense>
      )}
      {!inView && <div ref={ref}></div>}
    </>
  );
}
