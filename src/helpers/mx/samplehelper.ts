import { Beamline, containerType, sampleChangerType } from 'models';
import { ContainerDewar } from 'pages/model';
import { AbstractSampleChanger } from 'pages/prepareexperiment/samplechanger/abstractsamplechanger';
import { FlexHCDDual } from 'pages/prepareexperiment/samplechanger/flexhcddual';
import { FlexHCDUnipuckPlate } from 'pages/prepareexperiment/samplechanger/flexhdcunipuckplate';
import { ISARA } from 'pages/prepareexperiment/samplechanger/isara';
import { P11SC } from 'pages/prepareexperiment/samplechanger/p11sc';

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
  if (type === 'P11SC') {
    return new P11SC();
  }
  return undefined;
}

export function getContainerType(type: string | undefined): containerType | undefined {
  if (type?.toLowerCase() === 'unipuck') {
    return 'Unipuck';
  }
  if (type?.toLowerCase() === 'spinepuck' || type?.toLowerCase() === 'puck') {
    return 'Spinepuck';
  }
  if (type?.toLowerCase() === 'plate') {
    return 'PLATE';
  }
  return 'OTHER';
}

export function containerCanGoInLocation(changer: AbstractSampleChanger | undefined, containerType: string | undefined, location: number | undefined) {
  if (location && changer) {
    const pos = changer.getPosition(location);
    if (pos) {
      return changer.getContainerType(pos.cell, pos.position) === getContainerType(containerType);
    }
  }
  return false;
}

export function getContainerBeamline(beamlines: Beamline[], container: ContainerDewar) {
  for (const beamline of beamlines) {
    if (container.beamlineLocation === beamline.name) {
      return beamline;
    }
  }
  return undefined;
}
