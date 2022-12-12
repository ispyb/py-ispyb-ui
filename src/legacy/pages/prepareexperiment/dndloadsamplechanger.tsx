import { ContainerDewar } from 'legacy/pages/model';
import { MXContainer } from 'legacy/pages/mx/container/mxcontainer';
import { useState, useEffect } from 'react';
import { Alert, Col, Row } from 'react-bootstrap';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';

import { getEmptyImage } from 'react-dnd-html5-backend';
import { Beamline } from 'legacy/models';
import { CustomDragLayer, ItemTypes } from './dndlayer';
import DnDSampleChanger from './dndsamplechanger';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import {
  getContainerBeamline,
  getContainerType,
  getSampleChanger,
} from 'legacy/helpers/mx/samplehelper';

import './dndloadsamplechanger.scss';
import { BeamLineSelector } from './tableloadsamplechanger';

export default function DnDLoadSampleChanger({
  dewars,
  proposalName,
  setContainerLocation,
  beamlines,
}: {
  dewars?: ContainerDewar[];
  proposalName: string;
  // eslint-disable-next-line no-unused-vars
  setContainerLocation: (
    containerId: number,
    beamline: string | undefined,
    position: string | undefined
  ) => void;
  beamlines: Beamline[];
}) {
  const [beamline, setBeamline] = useState(
    findBestDefaultBeamline(beamlines, dewars)
  );

  return (
    <Col>
      <Row>
        <Col></Col>
        <Col md={'auto'}>
          <Alert variant="info">
            <FontAwesomeIcon
              icon={faInfoCircle}
              style={{ marginRight: 10 }}
            ></FontAwesomeIcon>
            Select destination beamline and drag containers to their location.
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
                      <DragableContainer
                        d={d}
                        beamlines={beamlines}
                        proposalName={proposalName}
                      ></DragableContainer>
                    </div>
                  </Col>
                );
              })}
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col></Col>
              <Col md={'auto'}>
                <BeamLineSelector
                  beamline={beamline}
                  beamlines={beamlines}
                  setBeamline={setBeamline}
                ></BeamLineSelector>
              </Col>
              <Col></Col>
            </Row>
            <Row>
              <div
                style={{
                  width: 400,
                  margin: 'auto',
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                <DnDSampleChanger
                  beamline={beamline}
                  setContainerLocation={setContainerLocation}
                  proposalName={proposalName}
                  containers={dewars}
                ></DnDSampleChanger>
              </div>
            </Row>
          </div>
          <CustomDragLayer proposalName={proposalName}></CustomDragLayer>
        </DndProvider>
      </Row>
    </Col>
  );
}

export function findBestDefaultBeamline(
  beamlines: Beamline[],
  containers?: ContainerDewar[]
) {
  if (containers) {
    //first look for beamline with a sample that has a location defined
    for (const container of containers) {
      if (
        container.beamlineLocation &&
        !isNaN(Number(container.sampleChangerLocation))
      ) {
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

function DragableContainer({
  d,
  proposalName,
  beamlines,
}: {
  d: ContainerDewar;
  proposalName: string;
  beamlines: Beamline[];
}) {
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

  const beamline = getContainerBeamline(beamlines, d);
  const changer = getSampleChanger(beamline?.sampleChangerType);
  const pos = changer?.getPosition(Number(d.sampleChangerLocation));
  return (
    <div style={{ width: 100, height: 160 }}>
      <Col style={{ height: 20 }}>
        <Row>
          <p style={{ height: 20, padding: 0, margin: 0, textAlign: 'center' }}>
            <strong>[{d.shippingName.slice(0, 15)}]</strong>{' '}
            {d.containerCode.slice(0, 15)}
          </p>
        </Row>
      </Col>
      <div
        ref={drag}
        style={{
          backgroundColor: 'white',
          cursor: 'grab',
          opacity: isDragging ? 0 : 1,
        }}
      >
        <MXContainer
          showInfo={false}
          containerType={getContainerType(d.containerType)}
          proposalName={proposalName}
          containerId={String(d.containerId)}
        ></MXContainer>
      </div>
      {pos && (
        <Col>
          <Row>
            <p style={{ padding: 0, margin: 0, textAlign: 'center' }}>
              {d.beamlineLocation}
            </p>
            <p style={{ padding: 0, margin: 0, textAlign: 'center' }}>
              cell {pos.cell + 1} pos {pos.position + 1}
            </p>
          </Row>
        </Col>
      )}
    </div>
  );
}
