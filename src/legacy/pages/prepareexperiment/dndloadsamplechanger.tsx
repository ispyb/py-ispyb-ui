import { ContainerDewar } from 'legacy/pages/model';
import { MXContainer } from 'legacy/pages/mx/container/mxcontainer';
import { useState, useEffect } from 'react';
import { Alert, Anchor, Button, Dropdown } from 'react-bootstrap';

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
import { DndProvider } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';

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
    <DndProvider options={HTML5toTouch}>
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: 150,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div>
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
          </div>
          <div
            style={{
              overflowY: 'auto',
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
              .sort((a, b) => {
                return b.containerId - a.containerId;
              })
              ?.map((d) => {
                return (
                  <div key={d.containerId}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <DragableContainer
                        d={d}
                        beamlines={beamlines}
                        proposalName={proposalName}
                      ></DragableContainer>
                    </div>
                    <hr />
                  </div>
                );
              })}
          </div>
        </div>

        <div style={{ borderLeft: '1px solid grey' }} />

        <div className="d-flex align-items-center">
          <FontAwesomeIcon
            style={{ height: 50, margin: 5 }}
            icon={faArrowRight}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 5,
            padding: 5,
            alignContent: 'center',
          }}
        >
          <Button size="sm" onClick={emptyAll}>
            Unload sample changer
          </Button>

          <Alert
            variant="info"
            style={{
              padding: 5,
              margin: 0,
            }}
          >
            <FontAwesomeIcon
              icon={faInfoCircle}
              style={{ marginRight: 10 }}
            ></FontAwesomeIcon>
            <small>
              Select destination beamline and drag containers to their location.
            </small>
          </Alert>

          <BeamLineSelector
            beamline={beamline}
            beamlines={beamlines}
            setBeamline={setBeamline}
          ></BeamLineSelector>

          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              overflow: 'hidden',
              justifyContent: 'center',
            }}
          >
            <DnDSampleChanger
              beamline={beamline}
              setContainerLocation={setContainerLocation}
              proposalName={proposalName}
              containers={dewars}
            ></DnDSampleChanger>
          </div>
          <CustomDragLayer proposalName={proposalName}></CustomDragLayer>
        </div>
      </div>
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          textAlign: 'center',
        }}
      >
        <strong>[{d.shippingName}]</strong> {d.containerCode}
      </span>

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
        <div
          style={{
            backgroundColor: 'lightgreen',
            borderRadius: 10,
            marginBottom: 5,
          }}
        >
          <p style={{ padding: 0, margin: 0, textAlign: 'center' }}>
            {d.beamlineLocation}
          </p>
          <p style={{ padding: 0, margin: 0, textAlign: 'center' }}>
            cell {pos.cell + 1} pos {pos.position + 1}
          </p>
        </div>
      )}
    </div>
  );
}
