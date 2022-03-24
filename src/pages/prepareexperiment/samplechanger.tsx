import { range } from 'lodash';
import { Dewar } from 'pages/model';
import { EmptyContainer, MXContainer } from 'pages/mx/container/mxcontainer';
import { PropsWithChildren } from 'react';
import { Col, Row } from 'react-bootstrap';
import './samplechanger.scss';

const containerRadius = 100;

function getContainersForCell(containers: Dewar[] | undefined, cell: number, beamline?: string) {
  if (!containers) {
    return [undefined, undefined, undefined];
  }
  return range(1, 4).map((n) => {
    const location = 3 * (cell - 1) + n;
    for (const c of containers) {
      if (c.beamlineLocation === beamline && Number(c.sampleChangerLocation) == location) {
        return c;
      }
    }
    return undefined;
  });
}

export default function SampleChanger({ beamline, containers, proposalName }: { beamline?: string; proposalName: string; containers?: Dewar[] }) {
  return (
    <Col>
      <Row>
        <h5 style={{ textAlign: 'center' }}>{beamline}</h5>
      </Row>
      <Row>
        <ChangerSVG>
          {range(1, 9).map((n) => {
            const containersCell = getContainersForCell(containers, n, beamline);
            return <CellSection proposalName={proposalName} containers={containersCell} n={n}></CellSection>;
          })}
        </ChangerSVG>
      </Row>
    </Col>
  );
}

export function getSectionAnle(n: number) {
  return (Math.PI / 8) * (2 * n - 1) + Math.PI;
}

function ChangerSVG({ children }: PropsWithChildren<unknown>) {
  return (
    <svg style={{ maxWidth: 500 }} viewBox={`-${containerRadius + 5} -${containerRadius + 5} ${2 * (containerRadius + 5)} ${2 * (containerRadius + 5)}`}>
      <g>
        <circle cx={0} cy={0} r={containerRadius} stroke={'#000'} fill="#CCCCCC"></circle>
        {[0, Math.PI / 2, Math.PI / 4, (3 * Math.PI) / 4].map((angle) => {
          return (
            <line
              stroke={'#000'}
              strokeWidth={0.6}
              x1={containerRadius * Math.sin(angle)}
              y1={containerRadius * Math.cos(angle)}
              x2={containerRadius * Math.sin(angle + Math.PI)}
              y2={containerRadius * Math.cos(angle + Math.PI)}
            ></line>
          );
        })}
        {range(1, 9).map((n) => {
          const angle = getSectionAnle(n);
          return (
            <g>
              <circle
                className="cell"
                cx={containerRadius * Math.sin(angle)}
                cy={-containerRadius * Math.cos(angle)}
                r={containerRadius / 10}
                stroke={'#000'}
                fill="#FFFF"
              ></circle>
              <text className="cellNumber" x={containerRadius * Math.sin(angle)} y={-containerRadius * Math.cos(angle) + 3}>
                {n}
              </text>
            </g>
          );
        })}
        {children}
      </g>
    </svg>
  );
}

function CellSection({ n, containers, proposalName }: { n: number; proposalName: string; containers: (Dewar | undefined)[] }) {
  const angle = getSectionAnle(n);

  const c1 = containerRadius * 0.45;
  const c2 = containerRadius * 0.75;
  const r = containerRadius / 8;
  const x = [c2 * Math.sin(angle - Math.PI / 16), c2 * Math.sin(angle + Math.PI / 16), c1 * Math.sin(angle)];
  const y = [-c2 * Math.cos(angle - Math.PI / 16), -c2 * Math.cos(angle + Math.PI / 16), -c1 * Math.cos(angle)];

  const ctxt1 = containerRadius * 0.29;
  const ctxt2 = containerRadius * 0.91;
  const xtxt = [ctxt2 * Math.sin(angle - Math.PI / 16), ctxt2 * Math.sin(angle + Math.PI / 16), ctxt1 * Math.sin(angle)];
  const ytxt = [-ctxt2 * Math.cos(angle - Math.PI / 16), -ctxt2 * Math.cos(angle + Math.PI / 16), -ctxt1 * Math.cos(angle)];

  return (
    <g>
      {range(0, 3).map((pos) => {
        return (
          <g>
            <svg x={x[pos] - r} y={y[pos] - r} width={2 * r} height={2 * r}>
              {containers[pos] ? (
                <MXContainer showInfo={false} proposalName={proposalName} containerId={String(containers[pos]?.containerId)}></MXContainer>
              ) : (
                <EmptyContainer></EmptyContainer>
              )}
            </svg>
            <text className="cellPositionNumber" x={xtxt[pos]} y={ytxt[pos] + 3}>
              {pos + 1}
            </text>
          </g>
        );
      })}
    </g>
  );
}
