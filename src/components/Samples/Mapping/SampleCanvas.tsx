import { useState, useRef, useEffect, useCallback } from 'react';
import { useSuspense } from 'rest-hooks';
import { Stage, Layer, Rect } from 'react-konva';
import Konva from 'konva';
import { Button, Container, Form, Navbar } from 'react-bootstrap';
import { ArrowsMove } from 'react-bootstrap-icons';

import { SubSampleResource } from 'api/resources/SubSample';
import { MapResource } from 'api/resources/Map';
import { SampleImageResource } from 'api/resources/SampleImage';

import { SubSample } from 'models/SubSample';
import { Map } from 'models/Map';
import { SampleImage } from 'models/SampleImage';

import Images from './Images';
import Maps, { getROIName } from './Maps';
import SubSamples from './SubSamples';

function SampleCanvasMain({
  images,
  subsamples,
  maps,
  selectedROI,
  selectedSubSample,
  showHidden,
}: {
  images: SampleImage[];
  subsamples: SubSample[];
  maps: Map[];
  selectedROI: string;
  showHidden: boolean;
  selectedSubSample: number | undefined;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState<number[]>([0, 0, 0, 0]);
  const [bounds, setBounds] = useState<number[]>([0, 0, 0, 0]);
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [parentSize, setParentSize] = useState<number[]>([1000, 800]);

  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    if (wrapRef.current) {
      setParentSize([
        wrapRef.current.clientWidth,
        wrapRef.current.clientHeight,
      ]);
    }
  }, [wrapRef]);

  const scaleStroke = useCallback(
    (scale: number) => {
      const stage = stageRef.current;
      if (stage !== null) {
        const rects = stage.find('Rect');
        rects.forEach((rect) => {
          rect.setAttrs({
            strokeWidth: 1 / scale,
          });
        });

        const labels = stage.find('Text');
        labels.forEach((rect) => {
          rect.scale({
            x: 1 / scale,
            y: 1 / scale,
          });
        });
      }
    },
    [stageRef]
  );

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
        scaleStroke(newScale);
        stage.batchDraw();
      }
    },
    [stageRef, scaleStroke]
  );

  const centerStage = useCallback(() => {
    const minXs = subsamples.map((subsample) => subsample.Position1?.posX || 0);
    const minYs = subsamples.map((subsample) => subsample.Position1?.posY || 0);

    const maxXs = subsamples.map(
      (subsample) =>
        (subsample.Position2?.posX
          ? subsample.Position2?.posX
          : subsample.Position1?.posX) || 0
    );
    const maxYs = subsamples.map(
      (subsample) =>
        (subsample.Position2?.posY
          ? subsample.Position2?.posY
          : subsample.Position1?.posY) || 0
    );

    const minX = minXs.length ? Math.min(...minXs) : 0;
    const minY = minYs.length ? Math.min(...minYs) : 0;
    const maxX = maxXs.length ? Math.max(...maxXs) : 0;
    const maxY = maxYs.length ? Math.max(...maxYs) : 0;

    console.log('constraints', minX, minY, maxX, maxY);
    const scaleX = maxX - minX > 0 ? 1024 / (maxX - minX) : 1;
    const scaleY = maxY - minY > 0 ? 1024 / (maxY - minY) : 1;
    const scale = scaleX < scaleY ? scaleX : scaleY;

    const cenX = Math.round((maxX - minX) / 2 + minX);
    const cenY = Math.round((maxY - minY) / 2 + minY);

    console.log('cen', cenX, cenY, 'scale', scaleX, scaleY);
    setCenter([cenX, cenY]);
    setBounds([minX, minY, maxX - minX, maxY - minY]);
    setScaleFactor(scale);

    const stage = stageRef.current;
    if (stage) {
      stage.scale({ x: scale, y: scale });
      stage.position({
        x: -cenX * scale + parentSize[0] / 2,
        y: -cenY * scale + parentSize[1] / 2,
      });
      scaleStroke(scale);
      stage.batchDraw();
    }
  }, [subsamples, parentSize, scaleStroke]);

  useEffect(() => {
    centerStage();
  }, [centerStage]);

  const showBounds = false;
  const showCenter = false;

  return (
    <div className="stage-wrapper position-relative" ref={wrapRef}>
      <Button
        onClick={() => centerStage()}
        className="position-absolute"
        style={{ right: 10, top: 10, zIndex: 100 }}
      >
        <ArrowsMove />
      </Button>
      <Stage
        key="canvas"
        width={parentSize[0]}
        height={parentSize[1]}
        draggable
        onWheel={zoomStage}
        ref={stageRef}
        style={{ border: '1px solid #ccc' }}
      >
        <Layer imageSmoothingEnabled={false}>
          <Images images={images} />
          {showBounds && bounds && bounds[0] > 0 && (
            <Rect
              key="bounds"
              x={bounds[0]}
              y={bounds[1]}
              width={bounds[2]}
              height={bounds[3]}
              stroke="blue"
              strokeWidth={1 / scaleFactor}
            ></Rect>
          )}

          {showCenter && center && center[0] > 0 && (
            <Rect
              key="bounds-center"
              x={center[0]}
              y={center[1]}
              width={100}
              height={100}
              stroke="yellow"
              strokeWidth={1 / scaleFactor}
            ></Rect>
          )}

          <Maps
            maps={maps}
            subsamples={subsamples}
            showHidden={showHidden}
            selectedROI={selectedROI}
          />
          <SubSamples
            subsamples={subsamples}
            scaleFactor={scaleFactor}
            selectedSubSample={selectedSubSample}
          />
        </Layer>
      </Stage>
    </div>
  );
}

export default function SampleCanvas({
  blSampleId,
  selectSample,
  selectedSubSample,
}: {
  blSampleId: number;
  selectSample: JSX.Element;
  selectedSubSample: number | undefined;
}) {
  const subsamples = useSuspense(SubSampleResource.list(), {
    blSampleId,
    limit: 9999,
  });
  const images = useSuspense(SampleImageResource.list(), {
    blSampleId,
    limit: 9999,
  });
  const maps = useSuspense(MapResource.list(), { blSampleId, limit: 9999 });

  const mapROIs = maps.results
    .map((map) => getROIName(map))
    .filter((v, i, a) => a.indexOf(v) === i);
  const [selectedROI, setSelectedROI] = useState<string>(
    (maps.results.length && getROIName(maps.results[0])) || ''
  );
  const [showHidden, setShowHidden] = useState<boolean>(false);

  return (
    <div>
      <Navbar bg="light" key="nav">
        <Container fluid>
          <Form className="d-flex align-items-center">
            {selectSample}
            <div className="ms-3 me-1 align-middle">ROI:</div>
            <Form.Control
              as="select"
              onChange={(event) => setSelectedROI(event.target.value)}
            >
              {mapROIs.map((roiName) => (
                <option key={roiName} value={roiName}>
                  {roiName}
                </option>
              ))}
            </Form.Control>
            <Form.Check
              style={{ flex: 1 }}
              className="ms-2 text-nowrap"
              type="switch"
              label="Show Hidden Maps"
              onChange={(e) => setShowHidden(e.target.checked)}
            />
          </Form>
        </Container>
      </Navbar>
      <SampleCanvasMain
        images={images.results}
        subsamples={subsamples.results}
        maps={maps.results}
        selectedROI={selectedROI}
        showHidden={showHidden}
        selectedSubSample={selectedSubSample}
      />
    </div>
  );
}
