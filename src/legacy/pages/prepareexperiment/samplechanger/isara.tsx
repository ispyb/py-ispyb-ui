import { containerType } from 'legacy/models';
import { AbstractSampleChanger } from './abstractsamplechanger';

export class ISARA extends AbstractSampleChanger {
  plotCells(): JSX.Element {
    return (
      <g>
        <rect
          x={-this.sampleChangerRadius * 2}
          y={-this.sampleChangerRadius * 2}
          width={this.sampleChangerRadius * 3}
          height={this.sampleChangerRadius * 1.17}
          fill="#FFFF"
          z={1000}
        ></rect>
        <line
          x2={-this.sampleChangerRadius * 0.56}
          y2={-this.sampleChangerRadius * 0.83}
          x1={this.sampleChangerRadius * 0.56}
          y1={-this.sampleChangerRadius * 0.83}
          stroke={'#000'}
        ></line>
      </g>
    );
  }

  getContainerCoordinates(
    cell: number,
    position: number
  ): { x: number; y: number; r: number; xtxt: number; ytxt: number } {
    const r = this.sampleChangerRadius / 8;

    const x = this.getX(position);
    const y = this.getY(position);

    const txtYDiff = -this.sampleChangerRadius * 0.16;

    return { x, y, r, xtxt: x, ytxt: y + txtYDiff };
  }

  getX(position: number): number {
    const drawingPosition = this.getDrawingPosition(position);
    if (drawingPosition.nbColumn === 5) {
      return [
        -this.sampleChangerRadius * 0.6,
        -this.sampleChangerRadius * 0.3,
        0,
        this.sampleChangerRadius * 0.3,
        this.sampleChangerRadius * 0.6,
      ][drawingPosition.column];
    }
    if (drawingPosition.nbColumn === 6) {
      return [
        -this.sampleChangerRadius * 0.75,
        -this.sampleChangerRadius * 0.45,
        -this.sampleChangerRadius * 0.15,
        this.sampleChangerRadius * 0.15,
        this.sampleChangerRadius * 0.45,
        this.sampleChangerRadius * 0.75,
      ][drawingPosition.column];
    }
    if (drawingPosition.nbColumn === 2) {
      return [
        -this.sampleChangerRadius * 0.15,
        this.sampleChangerRadius * 0.15,
      ][drawingPosition.column];
    }
    return 0;
  }

  getY(position: number): number {
    const drawingPosition = this.getDrawingPosition(position);
    const minY = -this.sampleChangerRadius * 0.6;
    const lineStep = this.sampleChangerRadius * 0.28;

    return drawingPosition.line * lineStep + minY;
  }

  getDrawingPosition(position: number): {
    line: number;
    column: number;
    nbColumn: 5 | 6 | 2;
  } {
    if (position < 5) {
      return { line: 0, column: position, nbColumn: 5 };
    }
    if (position < 11) {
      return { line: 1, column: position - 5, nbColumn: 6 };
    }
    if (position < 16) {
      return { line: 2, column: position - 11, nbColumn: 5 };
    }
    if (position < 22) {
      return { line: 3, column: position - 16, nbColumn: 6 };
    }
    if (position < 27) {
      return { line: 4, column: position - 22, nbColumn: 5 };
    }
    return { line: 5, column: position - 27, nbColumn: 2 };
  }

  getNbCell(): number {
    return 1;
  }
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  getNbContainerInCell(cell: number): number {
    return 29;
  }

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  getContainerType(cell: number, position: number): containerType {
    return 'Unipuck';
  }
}
