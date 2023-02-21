import {
  getMolDisplayName,
  MolData,
} from 'legacy/helpers/mx/results/phasingparser';
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

  const title = getMolDisplayName(mol);

  useEffect(() => {
    if (!inView && show !== defaultShow) setShow(defaultShow);
  }, [inView, show, defaultShow]);

  const fallback = (
    <LoadingUglyMolViewer
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
          <UglyMolViewer mol={mol} title={title} height={250} />
        </Suspense>
      </div>
    );
  } else {
    return <div ref={ref}>{fallback}</div>;
  }
}

export function LoadingUglyMolViewer({
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
      <Row>
        <Col></Col>
        <Col xs={'auto'}>
          <Button variant="link" size="sm" disabled>
            {show ? `${title} - loading` : title}
          </Button>
        </Col>
        <Col></Col>
      </Row>
    </Col>
  );
}

export function UglyMolViewer({
  mol,
  title,
  height,
  width = '100%',
}: {
  mol: MolData;
  title: string;
  height: number;
  width?: number | string;
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

  const getLoadingText = () => {
    if (!pdbLoaded) return 'Loading PDB...';
    if (!mapsLoaded) return 'Loading maps...';
    if (!peaksLoaded) return 'Loading peaks...';
    return 'Loading';
  };

  return (
    <>
      <UglyMolLoadingOverlay
        show={!pdbLoaded || !mapsLoaded || !peaksLoaded}
        message={getLoadingText()}
      />
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
        <Row>
          <Col></Col>
          <Col xs={'auto'}>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                viewerObject?.toggle_full_screen();
              }}
            >
              {title} - Fullscreen
            </Button>
          </Col>
          <Col></Col>
        </Row>
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
        {message}
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
