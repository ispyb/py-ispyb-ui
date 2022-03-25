import { ContainerDewar } from 'pages/model';
import { MXContainer } from 'pages/mx/container/mxcontainer';
import { useState, useEffect } from 'react';
import { Alert, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';

import { getEmptyImage } from 'react-dnd-html5-backend';
import { Beamline } from 'models';
import { CustomDragLayer, ItemTypes } from './dndlayer';
import DnDSampleChanger from './dndsamplechanger';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { getContainerPosition, getContainerType } from 'helpers/mx/samplehelper';

import './dndloadsamplechanger.scss';

export default function DnDLoadSampleChanger({
  dewars,
  proposalName,
  setContainerPosition,
  beamlines,
}: {
  dewars?: ContainerDewar[];
  proposalName: string;
  // eslint-disable-next-line no-unused-vars
  setContainerPosition: (containerId: number, beamline: string, position: string) => void;
  beamlines: Beamline[];
}) {
  const [beamline, setBeamline] = useState(findBestDefaultBeamline(beamlines, dewars));

  return (
    <Col>
      <Row>
        <Col></Col>
        <Col md={'auto'}>
          <Alert variant="info">
            <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 10 }}></FontAwesomeIcon>Select destination beamline and drag containers to their location.
          </Alert>
        </Col>

        <Col></Col>
      </Row>
      <Row>
        <DndProvider backend={HTML5Backend}>
          <div style={{ position: 'relative' }}>
            <Row>
              {dewars?.map((d) => {
                return (
                  <Col style={{ display: 'flex' }}>
                    <div style={{ margin: 'auto' }}>
                      <DragableContainer d={d} proposalName={proposalName}></DragableContainer>
                    </div>
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
              <div style={{ width: 400, margin: 'auto' }}>
                <DnDSampleChanger beamline={beamline} setContainerPosition={setContainerPosition} proposalName={proposalName} containers={dewars}></DnDSampleChanger>
              </div>
            </Row>
          </div>
          <CustomDragLayer proposalName={proposalName}></CustomDragLayer>
        </DndProvider>
      </Row>
    </Col>
  );
}

function findBestDefaultBeamline(beamlines: Beamline[], containers?: ContainerDewar[]) {
  if (containers) {
    //first look for beamline with a sample that has a location defined
    for (const container of containers) {
      if (container.beamlineLocation && getContainerPosition(container.sampleChangerLocation)) {
        for (const beamline of beamlines) {
          if (container.beamlineLocation === beamline.name) {
            return beamline;
          }
        }
      }
    }
    //if not found look for beamline with a sample that has no location defined
    for (const container of containers) {
      if (container.beamlineLocation) {
        for (const beamline of beamlines) {
          if (container.beamlineLocation === beamline.name) {
            return beamline;
          }
        }
      }
    }
  }
  //default to first
  return beamlines[0];
}

function DragableContainer({ d, proposalName }: { d: ContainerDewar; proposalName: string }) {
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

  const pos = getContainerPosition(d.sampleChangerLocation);
  return (
    <div style={{ width: 100, height: 160 }}>
      <Col style={{ height: 20 }}>
        <Row>
          <p style={{ height: 20, padding: 0, margin: 0, textAlign: 'center' }}>
            <strong>[{d.shippingName.slice(0, 15)}]</strong> {d.containerCode.slice(0, 15)}
          </p>
        </Row>
      </Col>
      <div
        ref={drag}
        style={{
          backgroundColor: 'white',
          cursor: 'move',
          opacity: isDragging ? 0 : 1,
        }}
      >
        <MXContainer showInfo={false} containerType={getContainerType(d.containerType)} proposalName={proposalName} containerId={String(d.containerId)}></MXContainer>
      </div>
      {pos && (
        <Col>
          <Row>
            <p style={{ padding: 0, margin: 0, textAlign: 'center' }}>{d.beamlineLocation}</p>
            <p style={{ padding: 0, margin: 0, textAlign: 'center' }}>
              cell {pos.cell} pos {pos.position}
            </p>
          </Row>
        </Col>
      )}
    </div>
  );
}
