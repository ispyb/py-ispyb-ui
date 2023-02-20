import _ from 'lodash';
import { Suspense, useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import { Viewer } from './uglymol';

export type MolData = {
  pdb: string;
  map1: string;
  map2: string;
  peaks?: string;
};

export function UglyMolPreview({
  mol,
  title,
}: {
  mol: MolData;
  title: string;
}) {
  const { ref, inView } = useInView({ rootMargin: '1000px 0px' });
  const [show, setShow] = useState(false);

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
          <Button variant="outline-secondary" onClick={() => setShow(true)}>
            Load molecule preview
          </Button>
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
    viewer.load_pdb(mol.pdb);
    viewer.load_ccp4_maps(mol.map1, mol.map2);
    if (mol.peaks) viewer.load_peaks(mol.peaks);

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
    };
  }, [mol, idViewer, idhud, idhelp]);

  return (
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
  );
}
