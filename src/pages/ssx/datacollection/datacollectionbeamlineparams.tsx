import SimpleParameterTable from 'components/table/simpleparametertable';
import { convertToExponential, convertToFixed, multiply, wavelengthToEnergy } from 'helpers/numerictransformation';
import { useSSXDataCollectionSample } from 'hooks/pyispyb';
import { SessionResponse } from 'pages/model';
import { Col, Row } from 'react-bootstrap';
import { SSXDataCollectionResponse, SSXSpecimenResponse } from '../model';

export default function SSXDataCollectionBeamlineParams({ dc, session }: { dc: SSXDataCollectionResponse; session?: SessionResponse }) {
  const { data: sample, isError } = useSSXDataCollectionSample(dc.ssxDataCollectionId);
  if (isError) throw Error(isError);

  return (
    <Row>
      <Col>
        <Section1 dc={dc} session={session} sample={sample}></Section1>
      </Col>
      <Col>
        <Section2 dc={dc} session={session} sample={sample}></Section2>
      </Col>
      <Col>
        <Section3 dc={dc} session={session} sample={sample}></Section3>
      </Col>
      <Col>
        <Section4 dc={dc} session={session} sample={sample}></Section4>
      </Col>
      <Col>
        <Section5 dc={dc} session={session} sample={sample}></Section5>
      </Col>
      <Col>
        <Section6 dc={dc} session={session} sample={sample}></Section6>
      </Col>
    </Row>
  );
}

export function Section1({ dc, session, sample }: { dc: SSXDataCollectionResponse; session?: SessionResponse; sample?: SSXSpecimenResponse }) {
  const parameters = [
    { key: 'Workflow', value: 'TODO' },
    { key: 'Protein', value: sample?.Specimen.Macromolecule.acronym },
    { key: 'Sample', value: sample?.Specimen.Macromolecule.name },
    { key: 'Prefix', value: dc.DataCollection.imagePrefix },
    { key: 'Run', value: dc.DataCollection.numberOfPasses },
    { key: '# Images', value: dc.DataCollection.numberOfImages },
    { key: 'Transmission', value: dc.DataCollection.transmission, units: '%' },
  ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}

export function Section2({ dc, session, sample }: { dc: SSXDataCollectionResponse; session?: SessionResponse; sample?: SSXSpecimenResponse }) {
  const parameters = [
    {
      key: 'Res. (corner)',
      value: `${convertToFixed(dc.DataCollection.resolution, 2)}  Å (${convertToFixed(dc.DataCollection.resolutionAtCorner, 2)}  Å )`,
    },

    {
      key: 'En. (Wave.)',
      value: `${convertToFixed(wavelengthToEnergy(dc.DataCollection.wavelength), 3)}  KeV (${convertToFixed(dc.DataCollection.wavelength, 4)} )`,
    },

    { key: 'Exposure Time', value: dc.DataCollection.exposureTime, units: 's' },
    { key: 'Flux start', value: convertToExponential(dc.DataCollection.flux, 2), units: 'ph/sec' },
    { key: 'Flux end', value: convertToExponential(dc.DataCollection.flux_end, 2), units: 'ph/sec' },
  ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}

export function Section3({ dc, session, sample }: { dc: SSXDataCollectionResponse; session?: SessionResponse; sample?: SSXSpecimenResponse }) {
  const parameters = [
    {
      key: 'Beamline Name',
      value: session?.beamLineName,
    },
    {
      key: 'Detector Distance',
      value: `${convertToFixed(dc.DataCollection.detectorDistance, 2)}`,
      units: 'mm',
    },
    {
      key: 'X Beam',
      value: `${convertToFixed(dc.DataCollection.xBeam, 2)}`,
      units: 'mm',
    },
    {
      key: 'Y Beam',
      value: `${convertToFixed(dc.DataCollection.yBeam, 2)}`,
      units: 'mm',
    },
  ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}

export function Section4({ dc, session, sample }: { dc: SSXDataCollectionResponse; session?: SessionResponse; sample?: SSXSpecimenResponse }) {
  const parameters = [
    {
      key: 'Synchrotron name',
      value: session?.BeamLineSetup?.synchrotronName,
    },
    {
      key: 'Synchrotron filling mode',
      value: session?.BeamLineSetup?.synchrotronMode,
    },
    {
      key: 'Synchrotron Current',
      value: 'TODO',
    },
    {
      key: 'Undulator types',
      value: [session?.BeamLineSetup?.undulatorType1, session?.BeamLineSetup?.undulatorType2, session?.BeamLineSetup?.undulatorType3].filter((a) => a).join(', '),
    },
    {
      key: 'Undulator gaps',
      value: 'Not available',
    },
  ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}
export function Section5({ dc, session, sample }: { dc: SSXDataCollectionResponse; session?: SessionResponse; sample?: SSXSpecimenResponse }) {
  const parameters = [
    {
      key: 'Focusing optics',
      value: session?.BeamLineSetup?.focusingOptic,
    },
    {
      key: 'Monochromator type',
      value: session?.BeamLineSetup?.monochromatorType,
    },

    {
      key: 'Beam size at Sample Hor (Vert)',
      value: `${multiply(dc.DataCollection.beamSizeAtSampleX, 1000)}(${multiply(dc.DataCollection.beamSizeAtSampleY, 1000)})`,
      units: 'μm',
    },
    {
      key: 'Beam divergence Hor (Vert)',
      value: `${session?.BeamLineSetup?.beamDivergenceHorizontal}(${session?.BeamLineSetup?.beamDivergenceVertical})`,
      units: 'μrad',
    },
    {
      key: 'Polarisation',
      value: session?.BeamLineSetup?.polarisation,
    },
  ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}
export function Section6({ dc, session, sample }: { dc: SSXDataCollectionResponse; session?: SessionResponse; sample?: SSXSpecimenResponse }) {
  const parameters = [
    {
      key: 'Detector Type',
      value: dc.DataCollection.Detector?.detectorType,
    },
    {
      key: 'Detector Model',
      value: dc.DataCollection.Detector?.detectorModel,
    },
    {
      key: 'Manufacturer',
      value: dc.DataCollection.Detector?.detectorManufacturer,
    },
    {
      key: 'Pixel Size Hor (Vert)',
      value: `${multiply(dc.DataCollection.Detector?.detectorPixelSizeHorizontal, 1000)}(${multiply(dc.DataCollection.Detector?.detectorPixelSizeVertical, 1000)})`,
      units: 'μm',
    },
  ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}
