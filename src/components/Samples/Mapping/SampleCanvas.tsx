import { useState, useRef, useEffect, useCallback } from 'react';
import { useSuspense } from 'rest-hooks';
import { Stage, Layer, Rect } from 'react-konva';
import Konva from 'konva';
import { Container, Form, Navbar } from 'react-bootstrap';

import { SubSampleResource } from 'api/resources/SubSample';
import { MapResource } from 'api/resources/Map';
import { SampleImageResource } from 'api/resources/SampleImage';

import { SubSample } from 'models/SubSample';
import { Map } from 'models/Map';
import { SampleImage } from 'models/SampleImage';

import Images from './Images';
import Maps from './Maps';
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
  selectedROI: number;
  showHidden: boolean;
  selectedSubSample: number | undefined;
}) {
  const [center, setCenter] = useState<number[]>([0, 0, 0, 0]);
  const [bounds, setBounds] = useState<number[]>([0, 0, 0, 0]);
  const [scaleFactor, setScaleFactor] = useState<number>(1);

  const stageRef = useRef<Konva.Stage>(null);

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
    const minXs = subsamples.map((subsample) => subsample.Position1?.posX);
    const minYs = subsamples.map((subsample) => subsample.Position1?.posY);

    const maxXs = subsamples.map((subsample) =>
      subsample.Position2?.posX
        ? subsample.Position2?.posX
        : subsample.Position1?.posX
    );
    const maxYs = subsamples.map((subsample) =>
      subsample.Position2?.posY
        ? subsample.Position2?.posY
        : subsample.Position1?.posY
    );

    // @ts-expect-error
    const minX = Math.min(...minXs);
    // @ts-expect-error
    const minY = Math.min(...minYs);
    // @ts-expect-error
    const maxX = Math.max(...maxXs);
    // @ts-expect-error
    const maxY = Math.max(...maxYs);

    console.log('constraints', minX, minY, maxX, maxY);
    const scaleX = 1024 / (maxX - minX);
    const scaleY = 1024 / (maxY - minY);
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
        x: -cenX * scale,
        y: -cenY * scale,
      });

      // const rects = stage.find('Rect')
      // rects.forEach(rect => {
      //   rect.setAttrs({
      //     scaleX: 1/scale,
      //     scaleY: 1/scale
      //   })
      // })

      stage.batchDraw();
    }
  }, [subsamples]);

  return (
    <Stage
      key="canvas"
      width={1100}
      height={800}
      draggable
      onWheel={zoomStage}
      ref={stageRef}
      style={{ border: '1px solid #ccc' }}
    >
      <Layer imageSmoothingEnabled={false}>
        <Images images={images} />
        {bounds && bounds[0] > 0 && (
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
        {center && center[0] > 0 && (
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

        <SubSamples
          subsamples={subsamples}
          scaleFactor={scaleFactor}
          selectedSubSample={selectedSubSample}
        />
        <Maps
          maps={maps}
          subsamples={subsamples}
          showHidden={showHidden}
          selectedROI={selectedROI}
        />
      </Layer>
    </Stage>
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
  const subsamples = useSuspense(SubSampleResource.list(), { blSampleId });
  const images = useSuspense(SampleImageResource.list(), { blSampleId });
  const maps = useSuspense(MapResource.list(), { blSampleId });

  const mapROIs = maps.results
    .map((map) => map.XRFFluorescenceMappingROI.xrfFluorescenceMappingROIId)
    .filter((v, i, a) => a.indexOf(v) === i);
  const [selectedROI, setSelectedROI] = useState<number>(mapROIs?.[0]);
  const [showHidden, setShowHidden] = useState<boolean>(false);

  return (
    <div>
      <Navbar bg="light" key="nav">
        <Container fluid>
          <Form className="d-flex">
            {selectSample}
            <Form.Control
              as="select"
              onChange={(event) => setSelectedROI(parseInt(event.target.value))}
            >
              {mapROIs.map((roiId) => {
                const mapROI = maps.results.filter(
                  (map) =>
                    map.XRFFluorescenceMappingROI
                      .xrfFluorescenceMappingROIId === roiId
                )[0];
                return (
                  <option key={roiId} value={roiId}>
                    <>
                      {mapROI.XRFFluorescenceMappingROI.scalar ? (
                        <>{mapROI.XRFFluorescenceMappingROI.scalar}</>
                      ) : (
                        <>
                          {mapROI.XRFFluorescenceMappingROI.element} -{' '}
                          {mapROI.XRFFluorescenceMappingROI.edge}
                        </>
                      )}
                    </>
                  </option>
                );
              })}
            </Form.Control>
            <Form.Check
              style={{ flex: 1 }}
              className="text-nowrap"
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
