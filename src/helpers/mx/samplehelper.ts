import { containerType, sampleChangerType } from 'models';
import { AbstractSampleChanger } from 'pages/prepareexperiment/samplechanger/abstractsamplechanger';
import { FlexHCDDual } from 'pages/prepareexperiment/samplechanger/flexhcddual';
import { FlexHCDUnipuckPlate } from 'pages/prepareexperiment/samplechanger/flexhdcunipuckplate';
import { ISARA } from 'pages/prepareexperiment/samplechanger/isara';

export function getSampleChanger(type?: sampleChangerType): AbstractSampleChanger | undefined {
  if (type === 'FlexHCDDual') {
    return new FlexHCDDual();
  }
  if (type === 'FlexHCDUnipuckPlate') {
    return new FlexHCDUnipuckPlate();
  }
  if (type === 'ISARA') {
    return new ISARA();
  }
  return undefined;
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

export function containerCanGoInPosition(changer: AbstractSampleChanger | undefined, containerType: string | undefined, position: string | undefined) {
  const pos = getContainerPosition(position);
  if (pos && changer) {
    return changer.getContainerType(pos.cell, pos.position) === getContainerType(containerType);
  }
  return false;
}
