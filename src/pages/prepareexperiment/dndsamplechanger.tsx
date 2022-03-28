import { range } from 'lodash';
import { ContainerDewar } from 'pages/model';
import { EmptyContainer, MXContainer } from 'pages/mx/container/mxcontainer';
import { PropsWithChildren, useState } from 'react';
import { Col, OverlayTrigger, Popover, Row } from 'react-bootstrap';

import { useDrop } from 'react-dnd';
import { ItemTypes } from './dndlayer';
import { Beamline } from 'models';

import './dndsamplechanger.scss';
import { getContainerTypes, getContainerType } from 'helpers/mx/samplehelper';

const sampleChangerRadius = 100;

function getContainersForCell(containers: ContainerDewar[] | undefined, cell: number, beamline: Beamline) {
  if (!containers) {
    return [undefined, undefined, undefined];
  }
  return range(1, 4).map((n) => {
    const location = 3 * cell + n;
    for (const c of containers) {
      if (c.beamlineLocation === beamline.name && Number(c.sampleChangerLocation) == location) {
        return c;
      }
    }
    return undefined;
  });
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
  setContainerLocation: (containerId: number, beamline: string | undefined, position: string | undefined) => void;
}) {
  const type = getContainerTypes(beamline.sampleChangerType);
  return (
    <Col>
      <Row>
        <ChangerSVG>
          {range(0, 8).map((n) => {
            const containersCell = getContainersForCell(containers, n, beamline);

            return (
              <CellSection
                beamline={beamline}
                containerType={type[n]}
                setContainerLocation={setContainerLocation}
                proposalName={proposalName}
                containers={containersCell}
                n={n}
              ></CellSection>
            );
          })}
        </ChangerSVG>
      </Row>
    </Col>
  );
}

export function getSectionAnle(n: number) {
  return (Math.PI / 8) * (2 * n + 1) + Math.PI;
}

function ChangerSVG({ children }: PropsWithChildren<unknown>) {
  return (
    <svg style={{ maxWidth: 500 }} viewBox={`-${sampleChangerRadius + 5} -${sampleChangerRadius + 5} ${2 * (sampleChangerRadius + 5)} ${2 * (sampleChangerRadius + 5)}`}>
      <g>
        <circle cx={0} cy={0} r={sampleChangerRadius} stroke={'#000'} fill="#CCCCCC"></circle>
        {[0, Math.PI / 2, Math.PI / 4, (3 * Math.PI) / 4].map((angle) => {
          return (
            <line
              stroke={'#000'}
              strokeWidth={0.6}
              x1={sampleChangerRadius * Math.sin(angle)}
              y1={sampleChangerRadius * Math.cos(angle)}
              x2={sampleChangerRadius * Math.sin(angle + Math.PI)}
              y2={sampleChangerRadius * Math.cos(angle + Math.PI)}
            ></line>
          );
        })}
        {range(0, 8).map((n) => {
          const angle = getSectionAnle(n);
          return (
            <g>
              <circle
                className="cell"
                cx={sampleChangerRadius * Math.sin(angle)}
                cy={-sampleChangerRadius * Math.cos(angle)}
                r={sampleChangerRadius / 10}
                stroke={'#000'}
                fill="#FFFF"
              ></circle>
              <text className="cellNumber" x={sampleChangerRadius * Math.sin(angle)} y={-sampleChangerRadius * Math.cos(angle) + 3}>
                {n + 1}
              </text>
            </g>
          );
        })}
        {children}
      </g>
    </svg>
  );
}

function CellSection({
  n,
  containers,
  proposalName,
  containerType = 'Spinepuck',
  beamline,
  setContainerLocation,
}: {
  n: number;
  proposalName: string;
  containers: (ContainerDewar | undefined)[];
  containerType?: 'Spinepuck' | 'Unipuck';
  beamline: Beamline;
  // eslint-disable-next-line no-unused-vars
  setContainerLocation: (containerId: number, beamline: string | undefined, position: string | undefined) => void;
}) {
  const angle = getSectionAnle(n);

  const c1 = sampleChangerRadius * 0.45;
  const c2 = sampleChangerRadius * 0.75;
  const r = sampleChangerRadius / 8;
  const x = [c2 * Math.sin(angle - Math.PI / 16), c2 * Math.sin(angle + Math.PI / 16), c1 * Math.sin(angle)];
  const y = [-c2 * Math.cos(angle - Math.PI / 16), -c2 * Math.cos(angle + Math.PI / 16), -c1 * Math.cos(angle)];

  const ctxt1 = sampleChangerRadius * 0.28;
  const ctxt2 = sampleChangerRadius * 0.92;
  const xtxt = [ctxt2 * Math.sin(angle - Math.PI / 16), ctxt2 * Math.sin(angle + Math.PI / 16), ctxt1 * Math.sin(angle)];
  const ytxt = [-ctxt2 * Math.cos(angle - Math.PI / 16), -ctxt2 * Math.cos(angle + Math.PI / 16), -ctxt1 * Math.cos(angle)];

  return (
    <g>
      {range(0, 3).map((pos) => {
        const container = containers[pos];
        return (
          <g>
            <svg x={x[pos] - r} y={y[pos] - r} width={2 * r} height={2 * r}>
              {container ? (
                <MXContainer
                  containerType={getContainerType(container.containerType)}
                  showInfo={false}
                  proposalName={proposalName}
                  containerId={String(container.containerId)}
                ></MXContainer>
              ) : (
                <EmptyContainer containerType={containerType}></EmptyContainer>
              )}
            </svg>
            <text className="cellPositionNumber" x={xtxt[pos]} y={ytxt[pos] + 3}>
              {pos + 1}
            </text>
            {container ? (
              <g>
                <circle cx={x[pos]} cy={y[pos]} r={r} stroke="black" fill="transparent"></circle>
                <RemoveContainerBtn
                  onClick={() => {
                    setContainerLocation(container.containerId, undefined, '');
                  }}
                  cx={x[pos]}
                  cy={y[pos]}
                  cr={r}
                ></RemoveContainerBtn>
                <InfoContainerBtn proposalName={proposalName} container={container} cx={x[pos]} cy={y[pos]} cr={r}></InfoContainerBtn>
              </g>
            ) : (
              <DroppablePosition
                containerType={containerType}
                beamline={beamline}
                setContainerLocation={setContainerLocation}
                position={3 * n + 1 + pos}
                x={x[pos]}
                y={y[pos]}
                r={r}
              ></DroppablePosition>
            )}
          </g>
        );
      })}
    </g>
  );
}

function RemoveContainerBtn({ cx, cy, cr, onClick }: { cx: number; cy: number; cr: number; onClick: () => void }) {
  const r = cr / 3;
  const x = cx + cr * Math.cos(Math.PI / 4);
  const y = cy - cr * Math.sin(Math.PI / 4);
  return (
    <g>
      <circle onClick={onClick} className="removeContainerBtn" cx={x} cy={y} r={r}></circle>
      <text className="removeContainerBtnTxt" x={x} y={y + 2.5}>
        ×
      </text>
    </g>
  );
}

function InfoContainerBtn({ cx, cy, cr, container, proposalName }: { cx: number; cy: number; cr: number; container: ContainerDewar; proposalName: string }) {
  const [show, setShow] = useState(false);

  const r = cr / 3;
  const x = cx + cr * Math.cos(Math.PI / 4);
  const y = cy + cr * Math.sin(Math.PI / 4);

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
    <OverlayTrigger show={show} key={'bottom'} placement={'left'} overlay={popover}>
      <g>
        <circle onClick={() => setShow(!show)} className={show ? 'infoContainerBtnClicked' : 'infoContainerBtn'} cx={x} cy={y} r={r}></circle>
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
  containerType: 'Spinepuck' | 'Unipuck';
  // eslint-disable-next-line no-unused-vars
  setContainerLocation: (containerId: number, beamline: string, position: string) => void;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CONTAINER,
      drop: (item: ContainerDewar) => {
        setContainerLocation(item.containerId, beamline.name, String(position));
      },
      canDrop: (item: ContainerDewar) => {
        const type = getContainerType(item.containerType);
        return type != undefined && type === containerType;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [beamline, position]
  );
  return <circle ref={drop} cx={x} cy={y} r={r} stroke={canDrop ? (isOver ? 'red' : 'yellow') : 'none'} fill={'transparent'}></circle>;
}
