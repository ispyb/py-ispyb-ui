import { MolData } from 'legacy/helpers/mx/results/phasingparser';
import _ from 'lodash';
import { Suspense, useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import { Viewer } from './uglymol';

export function UglyMolPreview({
  mol,
  defaultShow = false,
}: {
  mol: MolData;
  defaultShow?: boolean;
}) {
  const { ref, inView } = useInView({ rootMargin: '1000px 0px' });
  const [show, setShow] = useState(defaultShow);

  const title = mol.displayPdb;

  useEffect(() => {
    if (!inView && show !== defaultShow) setShow(defaultShow);
  }, [inView, show, defaultShow]);

  const fallback = (
    <UnloadedUglyMolViewer
      title={title}
      height={250}
      setShow={setShow}
      show={show}
    />
  );

  if (inView && show) {
    return (
      <div ref={ref}>
        <Suspense fallback={fallback}>
          <UglyMolViewer
            mol={mol}
            title={title}
            height={250}
            unload={() => setShow(false)}
          />
        </Suspense>
      </div>
    );
  } else {
    return <div ref={ref}>{fallback}</div>;
  }
}

export function UnloadedUglyMolViewer({
  title,
  height,
  width = '100%',
  setShow,
  show,
}: {
  title: string;
  height: number;
  width?: number | string;
  setShow: (show: boolean) => void;
  show: boolean;
}) {
  return (
    <Col>
      <div
        className="text-center"
        style={{
          height: height,
          width: width,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
        }}
      >
        {show ? (
          <Spinner animation="border" role="status" style={{ color: 'white' }}>
            <span className="visually-hidden"></span>
          </Spinner>
        ) : (
          <>
            <Button variant="outline-secondary" onClick={() => setShow(true)}>
              Load molecule preview
            </Button>
            <small style={{ color: 'white' }}>
              <i>Some molecules can be heavy to load.</i>
            </small>
          </>
        )}
      </div>
      <div style={{ backgroundColor: 'black', color: 'white', paddingLeft: 5 }}>
        <Row>
          <Col xs={'auto'} style={{ display: 'flex' }}>
            <strong style={{ display: 'flex', alignItems: 'center' }}>
              <small>PBD: {title}</small>
            </strong>
          </Col>
          <Col xs={'auto'} style={{ display: 'flex' }}>
            <Button
              variant="link"
              size="sm"
              style={{ padding: 0, color: 'white' }}
              onClick={() => setShow(true)}
            >
              <i>load</i>
            </Button>
          </Col>
          <Col></Col>
        </Row>
      </div>
    </Col>
  );
}

export function UglyMolViewer({
  mol,
  title,
  height,
  width = '100%',
  unload,
}: {
  mol: MolData;
  title: string;
  height: number;
  width?: number | string;
  unload?: () => void;
}) {
  const [idViewer] = useState(_.uniqueId('view-'));
  const [idhud] = useState(_.uniqueId('hud-'));
  const [idhelp] = useState(_.uniqueId('help-'));
  const [viewerObject, setViewerObject] = useState<Viewer | null>(null);

  const [pdbLoaded, setPdbLoaded] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [peaksLoaded, setPeaksLoaded] = useState(false);

  useEffect(() => {
    //create the viewer
    const opts = {
      viewer: idViewer,
      hud: idhud,
      help: idhelp,
      focusable: true,
    };
    const viewer = new Viewer(opts);
    setViewerObject(viewer);
    viewer.load_pdb(mol.pdb, null, () => setPdbLoaded(true));
    viewer.load_ccp4_maps(mol.map1, mol.map2, () => setMapsLoaded(true));
    if (mol.peaks) viewer.load_peaks(mol.peaks, () => setPeaksLoaded(true));
    if (!mol.peaks) setPeaksLoaded(true);
    return () => {
      //To clear effect, remove any child added by uglymol
      const viewerElem = document.getElementById(idViewer);
      const hudElem = document.getElementById(idhud);
      const helpElem = document.getElementById(idhelp);
      viewerElem?.childNodes.forEach((child) => {
        if (child === hudElem || child === helpElem) return;
        viewerElem.removeChild(child);
      });
      hudElem?.childNodes.forEach((child) => {
        hudElem.removeChild(child);
      });
      helpElem?.childNodes.forEach((child) => {
        helpElem.removeChild(child);
      });
      //Force disposal of the webGL context
      viewer.renderer
        ?.getContext()
        ?.getExtension('WEBGL_lose_context')
        ?.loseContext();
      setPdbLoaded(false);
      setMapsLoaded(false);
      setPeaksLoaded(false);
    };
  }, [mol, idViewer, idhud, idhelp]);

  const isLoading = !pdbLoaded || !mapsLoaded || !peaksLoaded;

  const loadingText = !pdbLoaded
    ? 'Loading PDB...'
    : !mapsLoaded
    ? 'Loading maps...'
    : !peaksLoaded
    ? 'Loading peaks...'
    : 'Loading';

  return (
    <>
      <UglyMolLoadingOverlay show={isLoading} message={loadingText} />
      <Col>
        <div
          id={idViewer}
          style={{ height: height, width: width, position: 'relative' }}
        >
          <span
            id={idhud}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              lineHeight: '1',
              whiteSpace: 'pre-wrap',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              pointerEvents: 'none',
            }}
          ></span>
          <small
            id={idhelp}
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              top: 0,
              overflow: 'auto',
              lineHeight: '1',
              whiteSpace: 'pre-wrap',
              backgroundColor: 'black',
              color: 'white',
            }}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onDoubleClick={(e) => {
              e.preventDefault();
            }}
            onKeyDown={(e) => {
              e.preventDefault();
            }}
          ></small>
        </div>
        <div
          style={{ backgroundColor: 'black', color: 'white', paddingLeft: 5 }}
        >
          <Row>
            <Col xs={'auto'} style={{ display: 'flex' }}>
              <strong style={{ display: 'flex', alignItems: 'center' }}>
                <small>PBD: {title}</small>
              </strong>
            </Col>
            <Col xs={'auto'} style={{ display: 'flex' }}>
              <Button
                variant="link"
                size="sm"
                style={{ padding: 0, color: 'white' }}
                onClick={() => {
                  viewerObject?.toggle_full_screen();
                }}
              >
                <i>fullscreen</i>
              </Button>
            </Col>
            <Col xs={'auto'} style={{ display: 'flex' }}>
              <Button
                variant="link"
                size="sm"
                style={{ padding: 0, color: 'white' }}
                onClick={unload}
              >
                <i>unload</i>
              </Button>
            </Col>
            <Col></Col>
            {isLoading && (
              <Col xs={'auto'}>
                <Spinner
                  animation="border"
                  role="status"
                  style={{ color: 'white', height: 20, width: 20 }}
                >
                  <span className="visually-hidden"></span>
                </Spinner>
                {loadingText}
              </Col>
            )}
          </Row>
        </div>
      </Col>
    </>
  );
}

function UglyMolLoadingOverlay({
  show,
  message,
}: {
  show: boolean;
  message: string;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 50,
        backgroundColor: 'black',
        display: show ? 'flex' : 'none',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
    >
      <Spinner
        animation="border"
        role="status"
        style={{ color: 'white', height: 20, width: 20 }}
      >
        <span className="visually-hidden"></span>
      </Spinner>
      <strong
        style={{
          color: 'white',
          fontSize: 20,
          margin: 0,
          marginLeft: 10,
        }}
      >
        Uglymol is {message.toLowerCase()}
      </strong>
      <small
        style={{
          color: 'white',
          margin: 0,
          marginLeft: 10,
        }}
      >
        <i>Browser might be slow.</i>
      </small>
    </div>
  );
}
