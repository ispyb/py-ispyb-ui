import React, {
  Suspense,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { useSuspense, useController } from 'rest-hooks';
import { Stage, Layer, Rect, Text, Image as KonvaImage } from 'react-konva';

import { SampleResource } from 'api/resources/Sample';
import { useProposal } from 'hooks/useProposal';
import { SubSampleResource } from 'api/resources/SubSample';
import { MapResource } from 'api/resources/Map';
import Konva from 'konva';
import { SampleImageResource } from 'api/resources/SampleImage';
import { getXHRBlob } from 'api/resources/XHRFile';
import { useAuth } from 'hooks/useAuth';
import Table from 'components/Layout/Table';
import { SubSample } from 'models/SubSample';
import { Map } from 'models/Map';
import { Container, Form, Navbar } from 'react-bootstrap';
import { SampleImage } from 'models/SampleImage';

function Images({
  images,
  blSampleId,
}: {
  images: SampleImage[];
  blSampleId: number;
}) {
  const { site } = useAuth();
  const { fetch } = useController();
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [preImages, setPreImages] = useState<Record<string, any>>({});

  useEffect(() => {
    setImagesLoaded(false);
    setPreImages([]);
  }, [blSampleId]);

  useEffect(() => {
    setImagesLoaded(false);
    setPreImages([]);

    async function getImages() {
      const preImages = {};
      for (const image of images) {
        const imageData = await fetch(getXHRBlob, {
          src: `${site.host}${image._metadata.url}`,
        });
        console.log('loaded image', imageData);
        // @ts-expect-error
        preImages[`${image.blSampleImageId}`] = imageData;
      }
      setPreImages(preImages);
    }
    getImages();
    console.log('images loaded');

    setImagesLoaded(true);
  }, [images, fetch, site.host]);

  return (
    <>
      {imagesLoaded && (
        <>
          {Object.entries(preImages).map(([imageId, blob]) => {
            const image = images.filter(
              (image) => image.blSampleImageId === parseInt(imageId)
            )[0];
            console.log('render image', image, imageId);
            const imageElement = new Image();
            imageElement.src = blob;
            return (
              <KonvaImage
                key={image.blSampleImageId}
                image={imageElement}
                x={image.offsetX}
                y={image.offsetY}
                scaleX={image.micronsPerPixelX * 1e3}
                scaleY={image.micronsPerPixelY * -1e3}
              />
            );
          })}
        </>
      )}
    </>
  );
}

function Maps({
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

function SampleCanvas({ blSampleId }: { blSampleId: number }) {
  const [center, setCenter] = useState<number[]>([0, 0, 0, 0]);
  const [bounds, setBounds] = useState<number[]>([0, 0, 0, 0]);
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const subsamples = useSuspense(SubSampleResource.list(), { blSampleId });
  const images = useSuspense(SampleImageResource.list(), { blSampleId });
  const maps = useSuspense(MapResource.list(), { blSampleId });

  const stageRef = useRef<Konva.Stage>(null);

  const mapROIs = maps.results
    .map((map) => map.XRFFluorescenceMappingROI.xrfFluorescenceMappingROIId)
    .filter((v, i, a) => a.indexOf(v) === i);
  const [selectedROI, setSelectedROI] = useState<number>(mapROIs?.[0]);
  const [showHidden, setShowHidden] = useState<boolean>(false);

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
    const minXs = subsamples.results.map(
      (subsample) => subsample.Position1?.posX
    );
    const minYs = subsamples.results.map(
      (subsample) => subsample.Position1?.posY
    );

    const maxXs = subsamples.results.map((subsample) =>
      subsample.Position2
        ? subsample.Position2?.posX
        : subsample.Position1?.posX
    );
    const maxYs = subsamples.results.map((subsample) =>
      subsample.Position2
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

      stage.batchDraw();
    }
  }, [subsamples.results]);

  return (
    <div>
      <Navbar bg="light" key="nav">
        <Container fluid>
          <Form className="d-flex">
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
                      {!mapROI.XRFFluorescenceMappingROI.scalar && (
                        <>
                          {mapROI.XRFFluorescenceMappingROI.element} -{' '}
                          {mapROI.XRFFluorescenceMappingROI.edge}
                        </>
                      )}
                      {mapROI.XRFFluorescenceMappingROI.scalar && (
                        <>{mapROI.XRFFluorescenceMappingROI.scalar}</>
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
          <Images images={images.results} blSampleId={blSampleId} />
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

          {subsamples.results.map((subsample) => {
            if (subsample.type === 'roi') {
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
                <React.Fragment key={subsample.blSubSampleId}>
                  <Rect
                    key="region"
                    x={subsample.Position1?.posX}
                    y={subsample.Position1?.posY}
                    width={width}
                    height={height}
                    stroke="purple"
                    strokeWidth={1 / scaleFactor}
                  />
                  <Text
                    key="text"
                    text={`${subsample.blSubSampleId}`}
                    stroke="purple"
                    fontSize={1 / scaleFactor}
                    x={subsample.Position1?.posX}
                    y={subsample.Position1?.posY}
                  />
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={subsample.blSubSampleId}>
                <Rect
                  key="point"
                  x={subsample.Position1?.posX}
                  y={subsample.Position1?.posY}
                  width={(1 / scaleFactor) * 10}
                  height={(1 / scaleFactor) * 10}
                  strokeWidth={1 / scaleFactor}
                  fill="green"
                />
                <Text
                  key="text"
                  text={`${subsample.blSubSampleId}`}
                  stroke="green"
                  fontSize={1 / scaleFactor}
                  x={subsample.Position1?.posX}
                  y={subsample.Position1?.posY}
                />
              </React.Fragment>
            );
          })}
          <Maps
            maps={maps.results}
            subsamples={subsamples.results}
            showHidden={showHidden}
            selectedROI={selectedROI}
          />
        </Layer>
      </Stage>
    </div>
  );
}

function SubSampleList({
  blSampleId,
  selectSubSample,
}: {
  blSampleId: number;
  selectSubSample: (blubSampleId: number) => void;
}) {
  const subsamples = useSuspense(SubSampleResource.list(), { blSampleId });

  const onRowClick = (row: SubSample) => {
    selectSubSample(row.blSubSampleId);
  };

  return (
    <>
      <Table
        keyId="blSubSampleId"
        results={subsamples.results}
        onRowClick={onRowClick}
        paginator={{
          total: subsamples.total,
          skip: subsamples.skip,
          limit: subsamples.limit,
        }}
        columns={[
          { label: '#', key: 'blSubSampleId', className: 'text-break' },
          { label: 'Type', key: 'type', className: 'text-nowrap' },
          {
            label: 'Data',
            key: '_metadata.datacollections',
            className: 'text-nowrap',
          },
          {
            label: 'DC Types',
            key: '_metadata.types',
            className: 'text-nowrap',
          },
        ]}
        emptyText="No sub samples yet"
      />
    </>
  );
}

function SubSampleView({ blSubSampleId }: { blSubSampleId: number }) {
  const maps = useSuspense(MapResource.list(), { blSubSampleId });
  return (
    <>
      <h1>SubSample: {blSubSampleId}</h1>
      <Table
        keyId="xrfFluorescenceMappingId"
        results={maps.results}
        paginator={{
          total: maps.total,
          skip: maps.skip,
          limit: maps.limit,
        }}
        columns={[
          {
            label: 'ID',
            key: 'xrfFluorescenceMappingId',
            className: 'text-break',
          },
          {
            label: 'Edge',
            key: 'XRFFluorescenceMappingROI.edge',
            className: 'text-nowrap',
          },
          {
            label: 'Element',
            key: 'XRFFluorescenceMappingROI.element',
            className: 'text-nowrap',
          },
          {
            label: 'Scalar',
            key: 'XRFFluorescenceMappingROI.scalar',
            className: 'text-nowrap',
          },
          { label: 'Visible', key: 'opacity', className: 'text-nowrap' },
        ]}
        emptyText="No maps yet"
      />
    </>
  );
}

function SubSamplePanel({ blSampleId }: { blSampleId: number }) {
  const [selectedSubSample, setSelectedSubSample] = useState<number>();
  return (
    <div style={{ flex: '1 1 30%', marginLeft: 5 }}>
      <SubSampleList
        blSampleId={blSampleId}
        selectSubSample={setSelectedSubSample}
      />
      {selectedSubSample && (
        <Suspense>
          <SubSampleView blSubSampleId={selectedSubSample} />
        </Suspense>
      )}
      {!selectedSubSample && <div>Please select a subsample</div>}
    </div>
  );
}

function SampleReviewMain() {
  const [selectedSample, setSelectedSample] = useState<number>(3);
  const proposal = useProposal();
  const samples = useSuspense(SampleResource.list(), {
    proposal: proposal.proposalName,
  });

  console.log('SampleReviewMain render', selectedSample);

  return (
    <>
      <div key="header">
        <Form.Control
          as="select"
          onChange={(event) => setSelectedSample(parseInt(event.target.value))}
        >
          {samples.results.map((sample) => (
            <option value={sample.blSampleId}>{sample.name}</option>
          ))}
        </Form.Control>
      </div>
      {selectedSample && (
        <div style={{ display: 'flex' }} key="main">
          <div style={{ flex: 1 }}>
            <SampleCanvas blSampleId={selectedSample} />
          </div>
          <SubSamplePanel blSampleId={selectedSample} />
        </div>
      )}
    </>
  );
}

export default function SampleReview() {
  return (
    <Suspense>
      <SampleReviewMain />
    </Suspense>
  );
}
