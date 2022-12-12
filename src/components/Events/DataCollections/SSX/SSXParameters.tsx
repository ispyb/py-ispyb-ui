import { DataCollection, Event } from 'models/Event';
import { Sample } from 'models/Sample';
import { useSuspense } from 'rest-hooks';
import { Session2Resource } from 'api/resources/Session';
import { faFlask, faVial } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { MetadataCol } from 'components/Events/Metadata';
import { SessionResponse } from 'models/SessionResponse';
import { Suspense } from 'react';
import Loading from 'components/Loading';
import { EventChains } from '../EventChains';

export default function SSXDataCollectionGroupParameters({
  dcg,
  sample,
}: {
  dcg: Event;
  sample: Sample;
}) {
  const session = useSuspense(Session2Resource.detail(), {
    sessionId: dcg.sessionId,
  });

  const dc = 'DataCollectionGroup' in dcg.Item ? dcg.Item : undefined;

  if (!dc || !sample) return null;

  return (
    <Col className="mt-3">
      <SamplePreparation sample={sample}></SamplePreparation>

      <Container fluid>
        <Row>
          <Col>
            <div
              style={{ border: '1px solid lightgray' }}
              className="rounded p-4 mb-3"
            >
              <Row>
                <Col xl={2} lg={4} md={6} sm={12}>
                  <h5 className="text-center">Storage ring</h5>
                  <StorageRing
                    dc={dc}
                    session={session}
                    sample={sample}
                  ></StorageRing>
                </Col>
                <Col></Col>
                <Col xl={2} lg={4} md={6} sm={12}>
                  <h5 className="text-center">Optics</h5>
                  <Optics dc={dc} session={session} sample={sample}></Optics>
                </Col>
                <Col></Col>
                <Col xl={2} lg={4} md={6} sm={12}>
                  <h5 className="text-center">Detector</h5>
                  <Detector
                    dc={dc}
                    session={session}
                    sample={sample}
                  ></Detector>
                </Col>
                <Col></Col>
                <Col xl={2} lg={4} md={6} sm={12}>
                  <h5 className="text-center">Collection</h5>
                  <Collection
                    dc={dc}
                    session={session}
                    sample={sample}
                  ></Collection>
                </Col>
                <Col></Col>
                <Col xl={2} lg={4} md={6} sm={12}>
                  <h5 className="text-center">Sample</h5>
                  <SampleParams
                    dc={dc}
                    session={session}
                    sample={sample}
                  ></SampleParams>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
      <Suspense fallback={<Loading />}>
        <EventChains dcg={dcg} />
      </Suspense>
    </Col>
  );
}

export function StorageRing({
  dc,
  session,
}: {
  dc: DataCollection;
  session?: SessionResponse;
  sample?: Sample;
}) {
  const properties = [
    { title: 'Filling mode', content: session?.BeamLineSetup?.synchrotronMode },
    { title: 'Current', content: 'MISSING?' },
    { title: 'Ondulator', content: session?.BeamLineSetup?.undulatorType1 },
    { title: 'Gap', content: dc.undulatorGap1 },
  ];
  return <MetadataCol properties={properties}></MetadataCol>;
}
export function Optics({
  dc,
  session,
}: {
  dc: DataCollection;
  session?: SessionResponse;
  sample?: Sample;
}) {
  const properties = [
    { title: 'KB', content: 'MISSING?' },
    { title: 'Mono type', content: session?.BeamLineSetup?.monochromatorType },
    { title: 'Mono bandwith', content: dc.SSXDataCollection?.energyBandwidth },
    { title: 'Mono stripe', content: dc.SSXDataCollection?.monoStripe },
    { title: 'Beam size X', content: dc.beamSizeAtSampleX },
    { title: 'Beam size Y', content: dc.beamSizeAtSampleY },
    { title: 'Beam shape', content: dc.beamShape },
    { title: 'Polarization', content: dc.polarisation },
  ];
  return <MetadataCol properties={properties}></MetadataCol>;
}
export function Detector({
  dc,
}: {
  dc: DataCollection;
  session?: SessionResponse;
  sample?: Sample;
}) {
  const properties = [
    { title: 'Type', content: dc.Detector?.detectorType },
    { title: 'Model', content: dc.Detector?.detectorModel },
    { title: 'Manufacturer', content: dc.Detector?.detectorManufacturer },
    {
      title: 'Pixel size horizontal',
      content: dc.Detector?.detectorPixelSizeHorizontal,
    },
    {
      title: 'Pixel size vertical',
      content: dc.Detector?.detectorPixelSizeVertical,
    },
    { title: 'Distance', content: dc.detectorDistance },
    { title: 'Resolution', content: dc.resolution },
    { title: 'X beam', content: dc.xBeam },
    { title: 'Y beam', content: dc.yBeam },
  ];
  return <MetadataCol properties={properties}></MetadataCol>;
}
export function SampleParams({
  sample,
  dc,
}: {
  dc: DataCollection;
  session?: SessionResponse;
  sample?: Sample;
}) {
  const properties = [
    { title: 'Protein', content: sample?.Crystal.Protein.acronym },
    { title: 'Sample', content: sample?.name },
    {
      title: 'Crystal size X, Y, Z',
      content: [
        sample?.Crystal.size_X,
        sample?.Crystal.size_Y,
        sample?.Crystal.size_Z,
      ]
        .map((v) => (v === undefined ? 'null' : v))
        .join(', '),
    },
    { title: 'Crystal concentration', content: sample?.Crystal.abundance },
    {
      title: 'Support',
      content: dc.DataCollectionGroup.experimentType?.split('SSX-')[1],
    },
    { title: 'Chip model', content: dc.SSXDataCollection?.chipModel },
    { title: 'Chip pattern', content: dc.SSXDataCollection?.chipPattern },
  ];
  return <MetadataCol properties={properties}></MetadataCol>;
}

export function Collection({
  dc,
}: {
  dc: DataCollection;
  session?: SessionResponse;
  sample?: Sample;
}) {
  const properties = [
    { title: 'Prefix', content: dc.imagePrefix },
    { title: 'Transmission', content: dc.transmission },
    { title: 'Number frames', content: dc.numberOfImages },
    { title: 'Sub sampling', content: 'MISSING?' },
    { title: 'Exposure time', content: dc.exposureTime },
    { title: 'Flux', content: dc.flux },
    { title: 'Jet speed', content: dc.SSXDataCollection?.jetSpeed },
    { title: 'Jet size', content: dc.SSXDataCollection?.jetSize },
    { title: 'Laser energy', content: dc.SSXDataCollection?.laserEnergy },
  ];
  return <MetadataCol properties={properties}></MetadataCol>;
}

export function SamplePreparation({ sample }: { sample?: Sample }) {
  if (!sample) {
    return <p>Could not find sample information.</p>;
  }
  return (
    <Container fluid>
      <Col>
        {sample.Crystal.crystal_compositions?.length ? (
          <Table size="sm" striped bordered hover>
            <thead>
              <tr>
                <th>
                  <h5>
                    <FontAwesomeIcon
                      icon={faVial}
                      style={{ marginRight: 10 }}
                    />
                    Crystal components
                  </h5>
                </th>
                <th>Name</th>
                <th>Concentration</th>
                <th>Composition</th>
                <th>pH</th>
              </tr>
            </thead>
            <tbody>
              {sample.Crystal.crystal_compositions &&
                sample.Crystal.crystal_compositions
                  .sort((a, b) =>
                    a.Component.ComponentType.name.localeCompare(
                      b.Component.ComponentType.name
                    )
                  )
                  .map((composition) => {
                    return (
                      <tr key={composition.Component.name}>
                        <th>
                          {componentTypeDisplayValue(
                            composition.Component.ComponentType.name
                          )}
                        </th>

                        <td>{composition.Component.name}</td>
                        <td>{composition.abundance}</td>
                        <td>{composition.Component.composition}</td>
                        <td>{composition.ph}</td>
                      </tr>
                    );
                  })}
            </tbody>
          </Table>
        ) : (
          <></>
        )}
        <Table size="sm" striped bordered hover>
          <thead>
            <tr>
              <th>
                <h5>
                  <FontAwesomeIcon icon={faFlask} style={{ marginRight: 10 }} />
                  Sample components
                </h5>
              </th>
              <th>Name</th>
              <th>Concentration</th>
              <th>Composition</th>
              <th>pH</th>
            </tr>
          </thead>
          <tbody>
            {sample.sample_compositions &&
              sample.sample_compositions
                .sort((a, b) =>
                  a.Component.ComponentType.name.localeCompare(
                    b.Component.ComponentType.name
                  )
                )
                .map((composition) => {
                  return (
                    <tr key={composition.Component.name}>
                      <th>
                        {componentTypeDisplayValue(
                          composition.Component.ComponentType.name
                        )}
                      </th>

                      <td>{composition.Component.name}</td>
                      <td>{composition.abundance}</td>
                      <td>{composition.Component.composition}</td>
                      <td>{composition.ph}</td>
                    </tr>
                  );
                })}
          </tbody>
        </Table>
      </Col>
    </Container>
  );
}

function componentTypeDisplayValue(componentType: string) {
  if (componentType === 'JetMaterial') return 'Jet material';
  return componentType;
}
