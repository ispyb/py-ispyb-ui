import { useAxisSystemContext } from '@h5web/lib';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { Plane, Vector3 } from 'three';

export function useVisClipping() {
  const { visSize } = useAxisSystemContext();
  const { width, height } = visSize;

  const gl = useThree((state) => state.gl);

  useEffect(() => {
    gl.clippingPlanes = [
      new Plane(new Vector3(0, 1, 0), height / 2),
      new Plane(new Vector3(0, -1, 0), height / 2),
      new Plane(new Vector3(1, 0, 0), width / 2),
      new Plane(new Vector3(-1, 0, 0), width / 2),
    ];
  }, [width, height, gl]);
}
