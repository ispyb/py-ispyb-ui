import SimpleParameterTable from 'components/table/simpleparametertable';
import { SessionResponse } from 'pages/model';
import { Col, Row } from 'react-bootstrap';
import { SamplePreparation } from '../datacollection/datacollectionsample';
import { Sequence } from '../datacollection/datacollectionsequence';
import { DataCollectionGroupResponse, SSXDataCollectionResponse, SSXSampleResponse, SSXSequenceResponse } from '../model';

export default function SSXDataCollectionGroupParameters({
  dcg,
  session,
  dcs,
  sample,
  sequences,
}: {
  dcg: DataCollectionGroupResponse;
  session: SessionResponse;
  proposalName: string;
  dcs: SSXDataCollectionResponse[];
  sample: SSXSampleResponse;
  sequences: SSXSequenceResponse[];
}) {
  return (
    <Row style={{ margin: 20 }}>
      <Col md={'auto'}>
        <h5>Storage ring</h5>
        <StorageRing dc={dcs[0]} session={session} sample={sample}></StorageRing>
      </Col>
      <Col md={'auto'}>
        <h5>Optics</h5>
        <Optics dc={dcs[0]} session={session} sample={sample}></Optics>
      </Col>
      <Col md={'auto'}>
        <h5>Detector</h5>
        <Detector dc={dcs[0]} session={session} sample={sample}></Detector>
      </Col>
      <Col md={'auto'}>
        <h5>Collection</h5>
        <Collection dc={dcs[0]} session={session} sample={sample}></Collection>
      </Col>
      <Col md={'auto'}>
        <h5>Sample</h5>
        <Sample dc={dcs[0]} dcg={dcg} session={session} sample={sample}></Sample>
      </Col>
      <Col md={'auto'}>
        <Row key={sequences[0].sequenceId}>
          <Sequence sequence={sequences[0]}></Sequence>
        </Row>
      </Col>
    </Row>
  );
}

export function StorageRing({ dc, session }: { dc: SSXDataCollectionResponse; session?: SessionResponse; sample?: SSXSampleResponse }) {
  const parameters = [
    { key: 'Filling mode', value: session?.BeamLineSetup?.synchrotronMode },
    { key: 'Current', value: 'MISSING?' },
    { key: 'Ondulator', value: session?.BeamLineSetup?.undulatorType1 },
    { key: 'Gap', value: dc.DataCollection.undulatorGap1 },
  ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}
export function Optics({ dc, session }: { dc: SSXDataCollectionResponse; session?: SessionResponse; sample?: SSXSampleResponse }) {
  const parameters = [
    { key: 'KB', value: 'MISSING?' },
    { key: 'Mono type', value: session?.BeamLineSetup?.monochromatorType },
    { key: 'Mono bandwith', value: dc.energyBandwidth },
    { key: 'Mono stripe', value: dc.monoStripe },
    { key: 'Beam size X', value: dc.DataCollection.beamSizeAtSampleX },
    { key: 'Beam size Y', value: dc.DataCollection.beamSizeAtSampleY },
    { key: 'Beam shape', value: dc.DataCollection.beamShape },
    { key: 'Polarization', value: dc.DataCollection.polarisation },
  ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}
export function Detector({ dc }: { dc: SSXDataCollectionResponse; session?: SessionResponse; sample?: SSXSampleResponse }) {
  const parameters = [
    { key: 'Type', value: dc.DataCollection.Detector?.detectorType },
    { key: 'Model', value: dc.DataCollection.Detector?.detectorModel },
    { key: 'Manufacturer', value: dc.DataCollection.Detector?.detectorManufacturer },
    { key: 'Pixel size horizontal', value: dc.DataCollection.Detector?.detectorPixelSizeHorizontal },
    { key: 'Pixel size vertical', value: dc.DataCollection.Detector?.detectorPixelSizeVertical },
    { key: 'Distance', value: dc.DataCollection.detectorDistance },
    { key: 'Resolution', value: dc.DataCollection.resolution },
    { key: 'X beam', value: dc.DataCollection.xBeam },
    { key: 'Y beam', value: dc.DataCollection.yBeam },
  ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}
export function Sample({ sample, dcg }: { dc: SSXDataCollectionResponse; session?: SessionResponse; sample?: SSXSampleResponse; dcg: DataCollectionGroupResponse }) {
  const parameters = [
    { key: 'Protein', value: sample?.Crystal.Protein.acronym },
    { key: 'Sample', value: sample?.name },
    { key: 'Crystal size X', value: sample?.Crystal.size_X },
    { key: 'Crystal size Y', value: sample?.Crystal.size_Y },
    { key: 'Crystal size Z', value: sample?.Crystal.size_Z },
    { key: 'Crystal concentration', value: sample?.Crystal.abundance },
    { key: 'Support', value: dcg.experimentType.split('SSX')[1] },
    { key: 'Chip model', value: 'TODO' },
    { key: 'Chip pattern', value: 'TODO' },
  ];
  return (
    <>
      <SimpleParameterTable parameters={parameters}></SimpleParameterTable>
      <SamplePreparation sample={sample}></SamplePreparation>
    </>
  );
}

export function Collection({ dc }: { dc: SSXDataCollectionResponse; session?: SessionResponse; sample?: SSXSampleResponse }) {
  const parameters = [
    { key: 'Prefix', value: dc.DataCollection.imagePrefix },
    { key: 'Transmission', value: dc.DataCollection.transmission },
    { key: 'Number frames', value: dc.DataCollection.numberOfImages },
    { key: 'Sub sampling', value: 'MISSING?' },
    { key: 'Exposure time', value: dc.DataCollection.exposureTime },
    { key: 'Flux', value: dc.DataCollection.flux },
    { key: 'Jet speed', value: 'TODO' },
    { key: 'Jet size', value: 'TODO' },
    { key: 'Laser energy', value: 'TODO' },
  ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}
