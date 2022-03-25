import { range } from 'lodash';
import { containerType, sampleChangerType } from 'models';

export function getContainerTypes(type?: sampleChangerType): (containerType | undefined)[] {
  if (type === 'FlexHCDDual') {
    return ['Spinepuck', 'Unipuck', 'Spinepuck', 'Unipuck', 'Unipuck', 'Unipuck', 'Unipuck', 'Unipuck'];
  }
  if (type === 'FlexHCDUnipuckPlate') {
    return ['Unipuck', 'Unipuck', 'Unipuck', 'Unipuck', 'Unipuck', 'Unipuck', 'Unipuck', 'Unipuck'];
  }
  return range(0, 8).map(() => undefined);
}

export function getContainerType(type: string | undefined): containerType | undefined {
  if (type === 'Unipuck') {
    return 'Unipuck';
  }
  if (type === 'Spinepuck' || type === 'Puck') {
    return 'Spinepuck';
  }
  if (type === 'Spinepuck' || type === 'Puck') {
    return 'Spinepuck';
  }
  return undefined;
}

export function getContainerPosition(n: undefined | string) {
  if (!n || isNaN(Number(n))) {
    return undefined;
  }
  const i = Number(n) - 1;
  return { cell: Math.floor(i / 3) + 1, position: (i % 3) + 1 };
}
