/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { range } from 'lodash';
import { containerType } from 'legacy/models';
import React from 'react';

export abstract class AbstractSampleChanger {
  sampleChangerRadius: number;

  constructor() {
    this.sampleChangerRadius = 100;
  }

  getChangerSVG(children: React.ReactNode) {
    return (
      <svg
        style={{ maxWidth: 500 }}
        viewBox={`-${this.sampleChangerRadius + 5} -${
          this.sampleChangerRadius + 5
        } ${2 * (this.sampleChangerRadius + 5)} ${
          2 * (this.sampleChangerRadius + 5)
        }`}
      >
        <circle
          cx={0}
          cy={0}
          r={this.sampleChangerRadius}
          stroke={'#000'}
          fill="#CCCCCC"
        ></circle>
        {this.plotCells()}
        <g>{children}</g>
      </svg>
    );
  }

  abstract plotCells(): JSX.Element;

  abstract getContainerCoordinates(
    cell: number,
    position: number
  ): { x: number; y: number; r: number; xtxt: number; ytxt: number };

  abstract getNbCell(): number;
  abstract getNbContainerInCell(cell: number): number;

  getLocation(cell: number, position: number) {
    let res = 0;
    range(0, cell).forEach((n) => {
      res = res + this.getNbContainerInCell(n);
    });
    return res + position + 1;
  }

  getPosition(
    location: number
  ): { position: number; cell: number } | undefined {
    if (isNaN(location)) {
      return undefined;
    }
    let minLocation = 1;
    for (const cell of range(0, this.getNbCell())) {
      const nbContainer = this.getNbContainerInCell(cell);
      if (minLocation + nbContainer <= location) {
        minLocation = minLocation + nbContainer;
      } else {
        return {
          cell,
          position: location - minLocation,
        };
      }
    }
    return undefined;
  }

  abstract getContainerType(cell: number, position: number): containerType;
}
