import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Dewar } from 'pages/model';
import { MXContainer } from 'pages/mx/container/mxcontainer';
import { useState, useEffect } from 'react';
import { Button, Col, Dropdown, DropdownButton, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';
import { XYCoord, useDragLayer } from 'react-dnd';

import './dndloadsamplechanger.scss';
import SampleChanger from './samplechanger';

export const ItemTypes = {
  CONTAINER: 'container',
};

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
            <SampleChanger beamline={beamline} setContainerPosition={setContainerPosition} proposalName={proposalName} containers={dewars}></SampleChanger>
          </div>
        </Row>
      </div>
      <CustomDragLayer></CustomDragLayer>
    </DndProvider>
  );
}

function getDragLayerStyles(initialOffset: XYCoord | null, currentOffset: XYCoord | null) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }

  const { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

function CustomDragLayer() {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  const renderItem = () => {
    console.log(itemType);
    switch (itemType) {
      case ItemTypes.CONTAINER:
        return (
          <div className="dragitem">
            <MXContainer showInfo={false} proposalName={'MX415'} containerType={item.containerType} containerId={item.containerId}></MXContainer>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isDragging) {
    return null;
  }

  return (
    <div className="draglayer">
      <div style={getDragLayerStyles(initialOffset, currentOffset)}>{renderItem()}</div>
    </div>
  );
}

function getPosition(n: undefined | string) {
  if (!n || isNaN(Number(n))) {
    return undefined;
  }
  return [Math.floor(Number(n) / 3) + 1, Number(n) % 3];
}
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Beamline } from 'models';

export function DragableContainer({ d, proposalName }: { d: Dewar; proposalName: string }) {
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

// eslint-disable-next-line no-unused-vars
export function SelectContainer({ container, setContainer }: { container: Dewar; setContainer: (c: Dewar) => void }) {
  if (!['Spinepuck', 'Unipuck', 'Puck'].includes(container.containerType)) {
    return <></>;
  }

  const onClick = () => {
    setContainer(container);
  };
  return (
    <OverlayTrigger placement="right" overlay={<Tooltip>Place container</Tooltip>}>
      <Button style={{ padding: 0 }} variant="link" onClick={onClick}>
        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
      </Button>
    </OverlayTrigger>
  );
}
