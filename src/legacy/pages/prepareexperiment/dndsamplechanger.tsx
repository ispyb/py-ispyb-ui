import { range } from 'lodash';
import { ContainerDewar } from 'legacy/pages/model';
import {
  EmptyContainer,
  MXContainer,
} from 'legacy/pages/mx/container/mxcontainer';
import { useEffect, useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './dndlayer';
import { Beamline, containerType } from 'legacy/models';

import './dndsamplechanger.scss';
import {
  getContainerType,
  getSampleChanger,
} from 'legacy/helpers/mx/samplehelper';
import { AbstractSampleChanger } from './samplechanger/abstractsamplechanger';
import { getEmptyImage } from 'react-dnd-html5-backend';

function getContainerOn(
  cell: number,
  position: number,
  changer: AbstractSampleChanger,
  containers: ContainerDewar[] | undefined,
  beamline: Beamline
) {
  if (!containers) {
    return undefined;
  }
  const location = changer.getLocation(cell, position);
  for (const c of containers) {
    if (
      c.beamlineLocation === beamline.name &&
      Number(c.sampleChangerLocation) === location
    ) {
      return c;
    }
  }
  return undefined;
}

export default function DnDSampleChanger({
  beamline,
  containers,
  proposalName,
  setContainerLocation,
}: {
  beamline: Beamline;
  proposalName: string;
  containers?: ContainerDewar[];
  // eslint-disable-next-line no-unused-vars
  setContainerLocation: (
    containerId: number,
    beamline: string | undefined,
    position: string | undefined
  ) => void;
}) {
  const changer = getSampleChanger(beamline.sampleChangerType);
  if (changer) {
    const containerJSX = range(0, changer.getNbCell()).map((cell) => {
      return range(0, changer.getNbContainerInCell(cell)).map((position) => {
        const container = getContainerOn(
          cell,
          position,
          changer,
          containers,
          beamline
        );
        return (
          <ChangerContainer
            key={position}
            beamline={beamline}
            setContainerLocation={setContainerLocation}
            proposalName={proposalName}
            container={container}
            changer={changer}
            cell={cell}
            position={position}
          ></ChangerContainer>
        );
      });
    });
    return <>{changer.getChangerSVG(containerJSX)}</>;
  }
  return <></>;
}

function ChangerContainer({
  changer,
  cell,
  position,
  container,
  proposalName,
  beamline,
  setContainerLocation,
}: {
  changer: AbstractSampleChanger;
  cell: number;
  position: number;
  container: ContainerDewar | undefined;
  proposalName: string;
  beamline: Beamline;
  // eslint-disable-next-line no-unused-vars
  setContainerLocation: (
    containerId: number,
    beamline: string | undefined,
    position: string | undefined
  ) => void;
}) {
  const { x, y, r, xtxt, ytxt } = changer.getContainerCoordinates(
    cell,
    position
  );

  const containerType = changer.getContainerType(cell, position);

  return (
    <g>
      <svg x={x - r} y={y - r} width={2 * r} height={2 * r}>
        <EmptyContainer containerType={containerType}></EmptyContainer>
        {container ? (
          <DragableChangerContainer
            {...{
              changer,
              cell,
              position,
              container,
              proposalName,
              beamline,
              setContainerLocation,
            }}
          />
        ) : null}
      </svg>

      <text className="cellPositionNumber" x={xtxt} y={ytxt + 3}>
        {position + 1}
      </text>

      {container ? null : (
        <DroppablePosition
          containerType={containerType}
          beamline={beamline}
          setContainerLocation={setContainerLocation}
          position={changer.getLocation(cell, position)}
          x={x}
          y={y}
          r={r}
        />
      )}
    </g>
  );
}

function DragableChangerContainer({
  changer,
  cell,
  position,
  container,
  proposalName,
  setContainerLocation,
}: {
  changer: AbstractSampleChanger;
  cell: number;
  position: number;
  container: ContainerDewar;
  proposalName: string;
  // eslint-disable-next-line no-unused-vars
  setContainerLocation: (
    containerId: number,
    beamline: string | undefined,
    position: string | undefined
  ) => void;
}) {
  const { r } = changer.getContainerCoordinates(cell, position);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.CONTAINER,
    item: container,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <g
      style={{
        opacity: isDragging ? 0 : 1,
      }}
    >
      <MXContainer
        containerType={getContainerType(container.containerType)}
        showInfo={false}
        proposalName={proposalName}
        containerId={String(container.containerId)}
      />
      <circle
        cx={r}
        cy={r}
        r={r}
        stroke="none"
        fill={'transparent'}
        ref={drag}
        cursor={'grab'}
      />
      <RemoveContainerBtn
        cx={0}
        cy={0}
        cr={r}
        onClick={() => {
          setContainerLocation(container.containerId, undefined, undefined);
        }}
      />
      <InfoContainerBtn
        proposalName={proposalName}
        container={container}
        cx={0}
        cy={0}
        cr={r}
      />
    </g>
  );
}

function RemoveContainerBtn({
  cx,
  cy,
  cr,
  onClick,
}: {
  cx: number;
  cy: number;
  cr: number;
  onClick: () => void;
}) {
  const angle = -Math.PI / 4;
  const r = cr / 5;
  const x = cx + cr + cr * Math.cos(angle);
  const y = cy + cr + cr * Math.sin(angle);
  return (
    <g>
      <circle
        onClick={onClick}
        className="removeContainerBtn"
        cx={x}
        cy={y}
        r={r}
      ></circle>
      <text className="removeContainerBtnTxt" x={x} y={y + 2.5}>
        ×
      </text>
    </g>
  );
}

function InfoContainerBtn({
  cx,
  cy,
  cr,
  container,
  proposalName,
}: {
  cx: number;
  cy: number;
  cr: number;
  container: ContainerDewar;
  proposalName: string;
}) {
  const [show, setShow] = useState(false);

  const angle = Math.PI / 4;
  const r = cr / 5;
  const x = cx + cr + cr * Math.cos(angle);
  const y = cy + cr + cr * Math.sin(angle);

  const popover = (
    <Popover style={{ width: 300 }}>
      <Popover.Header as="h3">Container</Popover.Header>
      <Popover.Body>
        <MXContainer
          containerType={getContainerType(container.containerType)}
          showInfo={true}
          proposalName={proposalName}
          containerId={String(container.containerId)}
        ></MXContainer>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      show={show}
      trigger="focus"
      rootClose
      onToggle={(v) => setShow(v)}
      placement={'left'}
      overlay={popover}
    >
      <g>
        <circle
          onClick={() => setShow(!show)}
          className={show ? 'infoContainerBtnClicked' : 'infoContainerBtn'}
          cx={x}
          cy={y}
          r={r}
        ></circle>
        <text className="infoContainerBtnTxt" x={x} y={y + 2.5}>
          i
        </text>
      </g>
    </OverlayTrigger>
  );
}

function DroppablePosition({
  x,
  y,
  r,
  position,
  beamline,
  containerType,
  setContainerLocation,
}: {
  x: number;
  y: number;
  r: number;
  position: number;
  beamline: Beamline;
  containerType: containerType;
  // eslint-disable-next-line no-unused-vars
  setContainerLocation: (
    containerId: number,
    beamline: string,
    position: string
  ) => void;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CONTAINER,
      drop: (item: ContainerDewar) => {
        setContainerLocation(item.containerId, beamline.name, String(position));
      },
      canDrop: (item: ContainerDewar) => {
        const type = getContainerType(item.containerType);
        return type !== undefined && type === containerType;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [beamline, position]
  );
  return (
    <circle
      ref={drop}
      cx={x}
      cy={y}
      r={r}
      stroke={canDrop ? '#00ff00' : 'none'}
      fill={canDrop && isOver ? '#00ff0045' : 'transparent'}
    ></circle>
  );
}
