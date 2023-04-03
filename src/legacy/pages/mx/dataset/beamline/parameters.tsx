import { Container } from 'react-bootstrap';
import { MetadataCol } from 'components/Events/Metadata';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import {
  convertToExponential,
  convertToFixed,
  wavelengthToEnergy,
} from 'legacy/helpers/numerictransformation';
import { PropsWithChildren } from 'react';

import MasonryLayout from 'components/Layout/Mansonry';

export default function MXDataCollectionGroupParameters({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  const breakpointColumnsObj = {
    default: 6,
    1700: 3,
    1200: 2,
    850: 1,
  };

  return (
    <MasonryLayout breakpointCols={breakpointColumnsObj} separator={true}>
      <ParamCol title="Collection">
        <Collection dataCollectionGroup={dataCollectionGroup}></Collection>
      </ParamCol>
      <ParamCol title="Sample">
        <Sample dataCollectionGroup={dataCollectionGroup}></Sample>
      </ParamCol>
      <ParamCol title="Synchrotron">
        <Synchrotron dataCollectionGroup={dataCollectionGroup}></Synchrotron>
      </ParamCol>
      <ParamCol title="Beam">
        <Beam dataCollectionGroup={dataCollectionGroup}></Beam>
      </ParamCol>
      <ParamCol title="Optics">
        <Optics dataCollectionGroup={dataCollectionGroup}></Optics>
      </ParamCol>
      <ParamCol title="Detector">
        <Detector dataCollectionGroup={dataCollectionGroup}></Detector>
      </ParamCol>
    </MasonryLayout>
  );
}

function ParamCol({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <>
      <h5 className="text-center text-primary">{title}</h5>
      <Container>{children}</Container>
    </>
  );
}

export function Sample({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  const properties = [
    { title: 'Protein', content: dataCollectionGroup.Protein_acronym },
    { title: 'Sample', content: dataCollectionGroup.BLSample_name },
    { title: 'Shipment', content: dataCollectionGroup.Shipping_shippingName },
    { title: 'Parcel', content: dataCollectionGroup.Dewar_code },
    {
      title: 'Container / Position',
      content: `${dataCollectionGroup.Container_code}/${dataCollectionGroup.BLSample_location}`,
    },
    {
      title: 'Beamline location',
      content: dataCollectionGroup.Container_beamlineLocation,
    },
    {
      title: 'Sample Changer Location',
      content: dataCollectionGroup.Container_sampleChangerLocation,
    },
  ];
  return <MetadataCol truncate={false} properties={properties}></MetadataCol>;
}

export function Synchrotron({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  const properties = [
    {
      title: 'Name',
      content: dataCollectionGroup.BeamLineSetup_synchrotronName,
    },
    {
      title: 'Filling mode',
      content: dataCollectionGroup.BeamLineSetup_synchrotronMode,
    },
    {
      title: 'Current',
      content: `${convertToFixed(
        dataCollectionGroup.synchrotronCurrent?.split(',')[0],
        1
      )}`,
    },
    { title: 'Ondulator', content: 'Not available' },
    { title: 'Gap', content: 'Not available' },
  ];
  return <MetadataCol truncate={false} properties={properties}></MetadataCol>;
}

export function Beam({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  const {
    DataCollection_axisStart = 0,
    DataCollection_axisEnd = 0,
    DataCollection_resolution,
    DataCollection_resolutionAtCorner,
    DataCollection_wavelength,
    DataCollection_rotationAxis,
    DataCollection_axisRange,
    DataCollection_exposureTime,
    DataCollection_flux,
    DataCollection_flux_end,
    DataCollection_xBeam,
    DataCollection_yBeam,
    DataCollection_kappaStart,
    DataCollection_phiStart,
  } = dataCollectionGroup;
  const axisRange = DataCollection_axisEnd - DataCollection_axisStart;

  const properties = [
    {
      title: 'Res. (corner)',
      content: `${convertToFixed(
        DataCollection_resolution,
        2
      )}  Å (${convertToFixed(DataCollection_resolutionAtCorner, 2)}  Å )`,
    },

    {
      title: 'En. (Wave.)',
      content: `${convertToFixed(
        wavelengthToEnergy(DataCollection_wavelength),
        3
      )}  KeV (${convertToFixed(DataCollection_wavelength, 4)} )`,
    },

    {
      title: `${DataCollection_rotationAxis} range`,
      content: `${convertToFixed(DataCollection_axisRange, 2)}`,
      unit: '°',
    },
    {
      title: `${DataCollection_rotationAxis} start (total)`,
      content: `${convertToFixed(
        DataCollection_axisStart,
        2
      )} ° (${convertToFixed(axisRange, 2)})`,
    },
    {
      title: 'Exposure Time',
      content: DataCollection_exposureTime,
      unit: 's',
    },
    {
      title: 'Flux start',
      content: convertToExponential(DataCollection_flux, 2),
      unit: 'ph/sec',
    },
    {
      title: 'Flux end',
      content: convertToExponential(DataCollection_flux_end, 2),
      unit: 'ph/sec',
    },
    {
      title: 'X Beam',
      content: `${convertToFixed(DataCollection_xBeam, 2)}`,
      unit: 'mm',
    },
    {
      title: 'Y Beam',
      content: `${convertToFixed(DataCollection_yBeam, 2)}`,
      unit: 'mm',
    },
    {
      title: 'Kappa',
      content: DataCollection_kappaStart,
    },
    {
      title: 'Phi',
      content: DataCollection_phiStart,
    },
  ];
  return <MetadataCol truncate={false} properties={properties}></MetadataCol>;
}

export function Optics({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  const properties = [
    {
      title: 'Focussing optics',
      content: dataCollectionGroup.BeamLineSetup_focusingOptic,
    },
    {
      title: 'Mono type',
      content: dataCollectionGroup.BeamLineSetup_monochromatorType,
    },
    {
      title: 'Beam size X',
      content: dataCollectionGroup.beamSizeAtSampleX
        ? dataCollectionGroup.beamSizeAtSampleX * 1000
        : undefined,
      unit: 'μm',
    },
    {
      title: 'Beam size Y',
      content: dataCollectionGroup.beamSizeAtSampleY
        ? dataCollectionGroup.beamSizeAtSampleY * 1000
        : undefined,
      unit: 'μm',
    },
    {
      title: 'Beam shape',
      content: dataCollectionGroup.DataCollection_beamShape,
    },
    {
      title: 'Beam divergence Hor',
      content: dataCollectionGroup.BeamLineSetup_beamDivergenceHorizontal,
      unit: 'μrad',
    },
    {
      title: 'Beam divergence Vert',
      content: dataCollectionGroup.BeamLineSetup_beamDivergenceVertical,
      unit: 'μrad',
    },
    {
      title: 'Polarization',
      content: dataCollectionGroup.BeamLineSetup_polarisation,
    },
  ];
  return <MetadataCol truncate={false} properties={properties}></MetadataCol>;
}
export function Detector({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  const properties = [
    { title: 'Type', content: dataCollectionGroup.Detector_detectorType },
    { title: 'Model', content: dataCollectionGroup.Detector_detectorModel },
    {
      title: 'Manufacturer',
      content: dataCollectionGroup.Detector_detectorManufacturer,
    },
    {
      title: 'Pixel size horizontal',
      content: dataCollectionGroup.Detector_detectorPixelSizeHorizontal
        ? dataCollectionGroup.Detector_detectorPixelSizeHorizontal * 1000
        : undefined,
      unit: 'μm',
    },
    {
      title: 'Pixel size vertical',
      content: dataCollectionGroup.Detector_detectorPixelSizeVertical
        ? dataCollectionGroup.Detector_detectorPixelSizeVertical * 1000
        : undefined,
      unit: 'μm',
    },
    {
      title: 'Distance',
      content: dataCollectionGroup.DataCollection_detectorDistance,
    },
    {
      title: 'Resolution',
      content: dataCollectionGroup.DataCollection_resolution,
    },
  ];
  return <MetadataCol truncate={false} properties={properties}></MetadataCol>;
}

export function Collection({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  const properties = [
    { title: 'Workflow', content: dataCollectionGroup.Workflow_workflowType },
    {
      title: 'Prefix',
      content: dataCollectionGroup.DataCollection_imagePrefix,
    },
    {
      title: 'Transmission',
      content: dataCollectionGroup.transmission,
      unit: '%',
    },
    {
      title: 'Run',
      content: dataCollectionGroup.DataCollection_dataCollectionNumber,
    },
    {
      title: '# Images (Total)',
      content: `${dataCollectionGroup.DataCollection_numberOfImages} (${dataCollectionGroup.totalNumberOfImages})`,
    },
  ];
  return <MetadataCol truncate={false} properties={properties}></MetadataCol>;
}
