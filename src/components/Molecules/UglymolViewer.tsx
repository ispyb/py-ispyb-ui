import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import LazyLoad from 'react-lazyload';
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
  return (
    <LazyLoad unmountIfInvisible={true} offset={1000} placeholder="...">
      <UglyMolViewer mol={mol} title={title} height={250} />
    </LazyLoad>
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
        <Col>
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
