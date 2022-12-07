import { containerType } from 'legacy/models';
import { AbstractSampleChanger } from './abstractsamplechanger';
import React from 'react';

export class P11SC extends AbstractSampleChanger {
  plotCells(): JSX.Element {
    return <></>;
  }

  getContainerCoordinates(
    cell: number,
    position: number
  ): { x: number; y: number; r: number; xtxt: number; ytxt: number } {
    const r = this.sampleChangerRadius / 8;
    const draw = this.getDrawingPosition(position);
    const x = draw.x - 10;
    const y = draw.y - 10;

    const txtYDiff = -this.sampleChangerRadius * 0.16;

    return { x, y, r, xtxt: x, ytxt: y + txtYDiff };
  }

  computePos(
    radiusRatio: number,
    maxPosition: number,
    position: number
  ): { x: number; y: number } {
    const containerRadius = this.sampleChangerRadius / 8;
    const radius = radiusRatio * containerRadius;
    const step = (Math.PI * 2) / maxPosition;
    const angle = (position - 1) * step;
    const x = Math.sin(angle) * radius + containerRadius;
    const y = containerRadius - Math.cos(angle) * radius;
    return { x, y };
  }

  getDrawingPosition(position: number): { x: number; y: number } {
    if (position < 1) {
      return this.computePos(0.3, 1, position);
    }
    if (position < 9) {
      return this.computePos(3.5, 8, position);
    }
    return this.computePos(6.5, 14, position - 8);
  }

  getNbCell(): number {
    return 1;
  }
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  getNbContainerInCell(cell: number): number {
    return 23;
  }

  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  getContainerType(cell: number, position: number): containerType {
    return 'Unipuck';
  }
}
