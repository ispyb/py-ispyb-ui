import { Annotation, useAxisSystemContext } from '@h5web/lib';
import { Fragment } from 'react';
import type { Vector3 } from 'three';
import { Vector2 } from 'three';
import { formatRealValue } from '../utils';

interface RingParam {
  radius: number;
  resolution: number;
}

interface Props {
  ringParams: RingParam[];
  color: string;
  beamCenterCoords: Vector3;
}

function ResolutionRings(props: Props) {
  const { ringParams, color, beamCenterCoords } = props;

  const { worldToData } = useAxisSystemContext();

  return (
    <>
      {ringParams.map(({ radius, resolution }, index) => {
        const pos = worldToData(
          new Vector2(beamCenterCoords.x, radius + beamCenterCoords.y)
        );
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={index}>
            <mesh>
              <meshBasicMaterial color={color} />
              <ringGeometry
                args={[
                  radius - 0.5,
                  radius + 0.5,
                  Math.floor(2 * Math.PI * radius), // segments of 1px guarantee circles of round aspect
                ]}
              />
            </mesh>
            <Annotation x={pos.x} y={pos.y}>
              <div
                style={{
                  color,
                  transform: 'translate3d(-50%, 0, 0)', // center the text
                  whiteSpace: 'nowrap',
                }}
              >
                {`${formatRealValue(resolution)} Å`}
              </div>
            </Annotation>
          </Fragment>
        );
      })}
    </>
  );
}

export default ResolutionRings;
