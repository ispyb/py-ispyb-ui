import { ContainerDewar } from 'legacy/pages/model';
import { MXContainer } from 'legacy/pages/mx/container/mxcontainer';
import { useState, useEffect } from 'react';
import { Alert, Anchor, Button, Col, Dropdown, Row } from 'react-bootstrap';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';

import { getEmptyImage } from 'react-dnd-html5-backend';
import { Beamline } from 'legacy/models';
import { CustomDragLayer, ItemTypes } from './dndlayer';
import DnDSampleChanger from './dndsamplechanger';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
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
  const [filterUnset, setFilterUnset] = useState(true);

  const emptyAll = () => {
    dewars?.forEach((d) => {
      setContainerLocation(d.containerId, undefined, undefined);
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Col>
        <Row>
          <Col xs={'auto'}>
            <Row>
              <Dropdown style={{ paddingRight: 0 }}>
                <Dropdown.Toggle
                  disabled={false}
                  size="sm"
                  variant="primary"
                  style={{ width: '100%', borderRadius: 0 }}
                >
                  {filterUnset ? 'Show not loaded' : 'Show all'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Anchor}
                    onClick={(e) => setFilterUnset(false)}
                  >
                    Show all
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Anchor}
                    onClick={(e) => setFilterUnset(true)}
                  >
                    Show not loaded
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Row>
            <Row>
              <Col
                style={{
                  maxHeight: 600,
                  overflow: 'auto',
                  marginLeft: 15,
                }}
              >
                {dewars
                  ?.filter((d) => {
                    if (filterUnset) {
                      return (
                        !d.sampleChangerLocation ||
                        d.sampleChangerLocation === 'undefined' ||
                        d.sampleChangerLocation === '' ||
                        !d.beamlineLocation ||
                        d.beamlineLocation === 'undefined' ||
                        d.beamlineLocation === ''
                      );
                    }
                    return true;
                  })
                  ?.map((d) => {
                    return (
                      <>
                        <Row key={d.dewarId}>
                          <div style={{ margin: 'auto' }}>
                            <DragableContainer
                              d={d}
                              beamlines={beamlines}
                              proposalName={proposalName}
                            ></DragableContainer>
                          </div>
                        </Row>
                        <Row style={{ borderTop: '1px solid gray' }}></Row>
                      </>
                    );
                  })}
              </Col>
            </Row>
          </Col>

          <Col xs={'auto'} style={{ borderLeft: '1px solid black' }} />
          <Col xs={'auto'} className="d-flex align-items-center" align="center">
            <FontAwesomeIcon style={{ height: 50 }} icon={faArrowRight} />
          </Col>
          <Col>
            <Row>
              <Col></Col>
              <Col xs={'auto'}>
                <Button
                  style={{
                    margin: 5,
                  }}
                  size="sm"
                  onClick={emptyAll}
                >
                  Unload sample changer
                </Button>
              </Col>
              <Col></Col>
            </Row>
            <Row>
              <Col></Col>
              <Col md={'auto'}>
                <Alert
                  variant="info"
                  style={{
                    padding: 5,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    style={{ marginRight: 10 }}
                  ></FontAwesomeIcon>
                  <small>
                    Select destination beamline and drag containers to their
                    location.
                  </small>
                </Alert>
              </Col>
              <Col></Col>
            </Row>
            <Row>
              <div style={{ position: 'relative' }}>
                <Row className="flex-nowrap"></Row>
                <Row>
                  <Col></Col>
                  <Col xs={'auto'}>
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
            </Row>
          </Col>
        </Row>
      </Col>
    </DndProvider>
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
    <div style={{ maxWidth: 100 }}>
      <Col>
        <Row>
          <p
            style={{
              padding: 0,
              margin: 0,
              textAlign: 'center',
            }}
          >
            <strong>[{d.shippingName}]</strong> {d.containerCode}
          </p>
        </Row>
      </Col>
      <div
        ref={drag}
        style={{
          width: 100,
          height: 100,
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
        <Col
          style={{
            backgroundColor: 'lightgreen',
            borderRadius: 10,
            marginBottom: 5,
          }}
        >
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
