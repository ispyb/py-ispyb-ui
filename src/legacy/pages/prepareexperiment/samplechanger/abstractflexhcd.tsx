import { range } from 'lodash';
import { containerType } from 'legacy/models';
import { AbstractSampleChanger } from './abstractsamplechanger';

function getSectionAnle(n: number) {
  return (Math.PI / 8) * (2 * n + 1) + Math.PI;
}

export abstract class AbstractFlexHCD extends AbstractSampleChanger {
  plotCells(): JSX.Element {
    return (
      <>
        {[0, Math.PI / 2, Math.PI / 4, (3 * Math.PI) / 4].map((angle) => {
          return (
            <line
              stroke={'#000'}
              strokeWidth={0.6}
              x1={this.sampleChangerRadius * Math.sin(angle)}
              y1={this.sampleChangerRadius * Math.cos(angle)}
              x2={this.sampleChangerRadius * Math.sin(angle + Math.PI)}
              y2={this.sampleChangerRadius * Math.cos(angle + Math.PI)}
            ></line>
          );
        })}
        {range(0, 8).map((n) => {
          const angle = getSectionAnle(n);
          return (
            <g>
              <circle
                className="cell"
                cx={this.sampleChangerRadius * Math.sin(angle)}
                cy={-this.sampleChangerRadius * Math.cos(angle)}
                r={this.sampleChangerRadius / 10}
                stroke={'#000'}
                fill="#FFFF"
              ></circle>
              <text
                className="cellNumber"
                x={this.sampleChangerRadius * Math.sin(angle)}
                y={-this.sampleChangerRadius * Math.cos(angle) + 3}
              >
                {n + 1}
              </text>
            </g>
          );
        })}
      </>
    );
  }

  getContainerCoordinates(
    cell: number,
    position: number
  ): { x: number; y: number; r: number; xtxt: number; ytxt: number } {
    const angle = getSectionAnle(cell);

    const c1 = this.sampleChangerRadius * 0.45;
    const c2 = this.sampleChangerRadius * 0.75;
    const r = this.sampleChangerRadius / 8;
    const x = [
      c2 * Math.sin(angle - Math.PI / 16),
      c2 * Math.sin(angle + Math.PI / 16),
      c1 * Math.sin(angle),
    ];
    const y = [
      -c2 * Math.cos(angle - Math.PI / 16),
      -c2 * Math.cos(angle + Math.PI / 16),
      -c1 * Math.cos(angle),
    ];

    const ctxt1 = this.sampleChangerRadius * 0.28;
    const ctxt2 = this.sampleChangerRadius * 0.92;
    const xtxt = [
      ctxt2 * Math.sin(angle - Math.PI / 16),
      ctxt2 * Math.sin(angle + Math.PI / 16),
      ctxt1 * Math.sin(angle),
    ];
    const ytxt = [
      -ctxt2 * Math.cos(angle - Math.PI / 16),
      -ctxt2 * Math.cos(angle + Math.PI / 16),
      -ctxt1 * Math.cos(angle),
    ];

    return {
      x: x[position],
      y: y[position],
      r,
      xtxt: xtxt[position],
      ytxt: ytxt[position],
    };
  }

  getNbCell(): number {
    return 8;
  }

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  getNbContainerInCell(cell: number): number {
    return 3;
  }

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  abstract getContainerType(cell: number, position: number): containerType;
}
