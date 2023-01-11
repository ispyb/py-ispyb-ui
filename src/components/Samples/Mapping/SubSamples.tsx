import React from 'react';
import {
  Rect,
  Text,
  Line,
  // Group
} from 'react-konva';

import { SubSample } from 'models/SubSample';

interface ICross {
  x: number | undefined;
  y: number | undefined;
  strokeWidth: number;
  fill: string;
}

function Cross({ x, y, strokeWidth, fill }: ICross) {
  const size = 10 * strokeWidth;
  if (!x || !y) return null;
  return (
    // <Group
    //   x={x}
    //   y={y}
    //   strokeWidth={strokeWidth}
    //   scaleX={strokeWidth}
    //   scaleY={strokeWidth}
    //   fill={fill}
    // >
    <>
      <Line
        strokeWidth={strokeWidth}
        stroke={fill}
        points={[x - size, y, x + size, y]}
      />
      <Line
        strokeWidth={strokeWidth}
        points={[x, y - size, x, y + size]}
        stroke={fill}
      />
    </>
    // </Group>
  );
}

const fontSize = 16;

export default function SubSamples({
  subsamples,
  scaleFactor,
  selectedSubSample,
}: {
  subsamples: SubSample[];
  scaleFactor: number;
  selectedSubSample: number | undefined;
}) {
  return (
    <>
      {subsamples.map((subsample) => {
        const strokeWidth = Math.max(1 / scaleFactor, 1);
        const fontScale = strokeWidth / 4;
        const textOffset = 5 * strokeWidth;
        if (subsample.type === 'roi') {
          const width =
            (subsample.Position1 &&
              subsample.Position2 &&
              subsample.Position2?.posX - subsample.Position1?.posX) ||
            100000;
          const height =
            (subsample.Position1 &&
              subsample.Position2 &&
              subsample.Position2?.posY - subsample.Position1?.posY) ||
            100000;

          return (
            <React.Fragment key={subsample.blSubSampleId}>
              <Rect
                key="region"
                x={subsample.Position1?.posX}
                y={subsample.Position1?.posY}
                width={width}
                height={height}
                stroke={
                  subsample.blSubSampleId === selectedSubSample
                    ? 'red'
                    : 'purple'
                }
                strokeWidth={strokeWidth}
              />
              <Text
                key="text"
                text={`${subsample.blSubSampleId}`}
                stroke={
                  subsample.blSubSampleId === selectedSubSample
                    ? 'red'
                    : 'purple'
                }
                fontSize={fontSize}
                scaleX={fontScale}
                scaleY={fontScale}
                x={(subsample.Position2?.posX || 0) + textOffset}
                y={(subsample.Position2?.posY || 0) + textOffset}
              />
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={subsample.blSubSampleId}>
            <Cross
              key="point"
              x={subsample.Position1?.posX}
              y={subsample.Position1?.posY}
              strokeWidth={strokeWidth}
              fill={
                subsample.blSubSampleId === selectedSubSample ? 'red' : 'green'
              }
            />
            <Text
              key="text"
              text={`${subsample.blSubSampleId}`}
              stroke={
                subsample.blSubSampleId === selectedSubSample ? 'red' : 'green'
              }
              fontSize={fontSize}
              scaleX={fontScale}
              scaleY={fontScale}
              x={(subsample.Position1?.posX || 0) + textOffset}
              y={(subsample.Position1?.posY || 0) + textOffset}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
