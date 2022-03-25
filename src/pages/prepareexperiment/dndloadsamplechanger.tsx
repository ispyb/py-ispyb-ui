import { Dewar } from 'pages/model';
import { MXContainer } from 'pages/mx/container/mxcontainer';
import { useState, useEffect } from 'react';
import { Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';

import { getEmptyImage } from 'react-dnd-html5-backend';
import { Beamline } from 'models';
import { CustomDragLayer, ItemTypes } from './dndlayer';
import DnDSampleChanger from './dndsamplechanger';

import './dndloadsamplechanger.scss';

export default function DnDLoadSampleChanger({
  dewars,
  proposalName,
  setContainerPosition,
  beamlines,
}: {
  dewars?: Dewar[];
  proposalName: string;
  // eslint-disable-next-line no-unused-vars
  setContainerPosition: (containerId: number, beamline: string, position: string) => void;
  beamlines: Beamline[];
}) {
  const [beamline, setBeamline] = useState(beamlines[0]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ position: 'relative' }}>
        <Row>
          {dewars?.map((d) => {
            return (
              <Col md={'auto'}>
                <DragableContainer d={d} proposalName={proposalName}></DragableContainer>
              </Col>
            );
          })}
        </Row>
        <Row>
          <Col></Col>
          <Col md={'auto'}>
            <DropdownButton id="dropdown-beamline" title={beamline.name}>
              {beamlines.map((b) => {
                return (
                  <Dropdown.Item
                    onClick={() => {
                      setBeamline(b);
                    }}
                  >
                    {b.name}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <div style={{ width: 450, margin: 'auto' }}>
            <DnDSampleChanger beamline={beamline} setContainerPosition={setContainerPosition} proposalName={proposalName} containers={dewars}></DnDSampleChanger>
          </div>
        </Row>
      </div>
      <CustomDragLayer></CustomDragLayer>
    </DndProvider>
  );
}

function getPosition(n: undefined | string) {
  if (!n || isNaN(Number(n))) {
    return undefined;
  }
  return [Math.floor(Number(n) / 3) + 1, Number(n) % 3];
}

function DragableContainer({ d, proposalName }: { d: Dewar; proposalName: string }) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.CONTAINER,
    item: d,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const pos = getPosition(d.sampleChangerLocation);
  return (
    <div style={{ width: 100 }}>
      <Col>
        <Row>
          <p style={{ padding: 0, margin: 0, textAlign: 'center' }}>
            <strong>[{d.shippingName}]</strong> {d.containerCode}
          </p>
        </Row>
      </Col>
      <div
        ref={drag}
        style={{
          backgroundColor: 'transparent',
          cursor: 'move',
          opacity: isDragging ? 0 : 1,
        }}
      >
        <MXContainer showInfo={false} containerType={d.containerType} proposalName={proposalName} containerId={String(d.containerId)}></MXContainer>
      </div>
      {pos && (
        <Col>
          <Row>
            <p style={{ padding: 0, margin: 0, textAlign: 'center' }}>{d.beamlineLocation}</p>
            <p style={{ padding: 0, margin: 0, textAlign: 'center' }}>
              cell {pos[0]} pos {pos[1]}
            </p>
          </Row>
        </Col>
      )}
    </div>
  );
}
