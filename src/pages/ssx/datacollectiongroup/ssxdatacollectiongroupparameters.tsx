import SimpleParameterTable from 'components/table/simpleparametertable';
import { useSample, useEventChains } from 'hooks/pyispyb';
import { DataCollection, Event } from 'models/Event';
import { Sample } from 'models/Sample';
import { SessionResponse } from 'pages/model';
import { Col, Row } from 'react-bootstrap';
import { SamplePreparation } from '../datacollection/datacollectionsample';
import { EventChain } from '../datacollection/datacollectioneventchain';

export default function SSXDataCollectionGroupParameters({ dcg, session }: { dcg: Event; session: SessionResponse }) {
  const dc = 'DataCollectionGroup' in dcg.Item ? dcg.Item : undefined;
  const { data: sample } = useSample({ blSampleId: dcg.blSampleId ? dcg.blSampleId : 0 });
  const { data: eventChains } = useEventChains({ datacollectionId: dc?.dataCollectionId || 0 });
  if (!dc || !sample) return null;

  return (
    <Row style={{ margin: 20 }}>
      <Col md={'auto'}>
        <h5>Storage ring</h5>
        <StorageRing dc={dc} session={session} sample={sample}></StorageRing>
      </Col>
      <Col md={'auto'}>
        <h5>Optics</h5>
        <Optics dc={dc} session={session} sample={sample}></Optics>
      </Col>
      <Col md={'auto'}>
        <h5>Detector</h5>
        <Detector dc={dc} session={session} sample={sample}></Detector>
      </Col>
      <Col md={'auto'}>
        <h5>Collection</h5>
        <Collection dc={dc} session={session} sample={sample}></Collection>
      </Col>
      <Col md={'auto'}>
        <h5>Sample</h5>
        <SampleParams dc={dc} session={session} sample={sample}></SampleParams>
      </Col>
      {eventChains &&
        eventChains.map((chain) => {
          return (
            <Col key={chain.eventChainId} md={'auto'}>
              <Row>
                <EventChain eventChain={chain}></EventChain>
              </Row>
            </Col>
          );
        })}
    </Row>
  );
}

export function StorageRing({ dc, session }: { dc: DataCollection; session?: SessionResponse; sample?: Sample }) {
  const parameters = [
    { key: 'Filling mode', value: session?.BeamLineSetup?.synchrotronMode },
    { key: 'Current', value: 'MISSING?' },
    { key: 'Ondulator', value: session?.BeamLineSetup?.undulatorType1 },
    { key: 'Gap', value: dc.undulatorGap1 },
  ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}
export function Optics({ dc, session }: { dc: DataCollection; session?: SessionResponse; sample?: Sample }) {
  const parameters = [
    { key: 'KB', value: 'MISSING?' },
    { key: 'Mono type', value: session?.BeamLineSetup?.monochromatorType },
    { key: 'Mono bandwith', value: dc.SSXDataCollection?.energyBandwidth },
    { key: 'Mono stripe', value: dc.SSXDataCollection?.monoStripe },
    { key: 'Beam size X', value: dc.beamSizeAtSampleX },
    { key: 'Beam size Y', value: dc.beamSizeAtSampleY },
    { key: 'Beam shape', value: dc.beamShape },
    { key: 'Polarization', value: dc.polarisation },
  ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}
export function Detector({ dc }: { dc: DataCollection; session?: SessionResponse; sample?: Sample }) {
  const parameters = [
    { key: 'Type', value: dc.Detector?.detectorType },
    { key: 'Model', value: dc.Detector?.detectorModel },
    { key: 'Manufacturer', value: dc.Detector?.detectorManufacturer },
    { key: 'Pixel size horizontal', value: dc.Detector?.detectorPixelSizeHorizontal },
    { key: 'Pixel size vertical', value: dc.Detector?.detectorPixelSizeVertical },
    { key: 'Distance', value: dc.detectorDistance },
    { key: 'Resolution', value: dc.resolution },
    { key: 'X beam', value: dc.xBeam },
    { key: 'Y beam', value: dc.yBeam },
  ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}
export function SampleParams({ sample, dc }: { dc: DataCollection; session?: SessionResponse; sample?: Sample }) {
  const parameters = [
    { key: 'Protein', value: sample?.Crystal.Protein.acronym },
    { key: 'Sample', value: sample?.name },
    { key: 'Crystal size X', value: sample?.Crystal.size_X },
    { key: 'Crystal size Y', value: sample?.Crystal.size_Y },
    { key: 'Crystal size Z', value: sample?.Crystal.size_Z },
    { key: 'Crystal concentration', value: sample?.Crystal.abundance },
    { key: 'Support', value: dc.DataCollectionGroup.experimentType?.split('SSX-')[1] },
    { key: 'Chip model', value: dc.SSXDataCollection?.chipModel },
    { key: 'Chip pattern', value: dc.SSXDataCollection?.chipPattern },
  ];
  return (
    <>
      <SimpleParameterTable parameters={parameters}></SimpleParameterTable>
      <SamplePreparation sample={sample}></SamplePreparation>
    </>
  );
}

export function Collection({ dc }: { dc: DataCollection; session?: SessionResponse; sample?: Sample }) {
  const parameters = [
    { key: 'Prefix', value: dc.imagePrefix },
    { key: 'Transmission', value: dc.transmission },
    { key: 'Number frames', value: dc.numberOfImages },
    { key: 'Sub sampling', value: 'MISSING?' },
    { key: 'Exposure time', value: dc.exposureTime },
    { key: 'Flux', value: dc.flux },
    { key: 'Jet speed', value: dc.SSXDataCollection?.jetSpeed },
    { key: 'Jet size', value: dc.SSXDataCollection?.jetSize },
    { key: 'Laser energy', value: dc.SSXDataCollection?.laserEnergy },
  ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}
