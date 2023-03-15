import Loading from 'components/Loading';
import { useMXDataCollectionsBy, useShipping } from 'legacy/hooks/ispyb';
import {
  ShippingContainer,
  ShippingDewar,
  ShippingSample,
} from 'legacy/pages/shipping/model';
import _ from 'lodash';
import { Suspense } from 'react';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { DataCollectionGroup } from '../model';

export function ShippingsInfo({
  sessionId,
  proposalName,
}: {
  sessionId: string;
  proposalName: string;
}) {
  const { data: dataCollectionGroups } = useMXDataCollectionsBy({
    proposalName,
    sessionId,
  });

  const shippings = _(dataCollectionGroups || [])
    .map((dcg) => dcg.Shipping_shippingId)
    .uniq()
    .value();

  if (shippings.filter((s) => s !== undefined).length === 0)
    return (
      <Container fluid>
        <Container fluid>
          <Col>
            <Alert variant="info">No shipping found</Alert>
          </Col>
        </Container>
      </Container>
    );

  return (
    <Container fluid>
      <Col>
        <Row></Row>
        <ShippingInfoLegend />
        {_(shippings)
          .sort()
          .value()
          .map(
            (shippingId) =>
              shippingId && (
                <Suspense key={shippingId} fallback={<Loading />}>
                  <ShippingInfo
                    key={shippingId}
                    sessionId={sessionId}
                    proposalName={proposalName}
                    shippingId={shippingId}
                    dataCollectionGroups={dataCollectionGroups || []}
                  />
                </Suspense>
              )
          )}
      </Col>
    </Container>
  );
}

export function ShippingInfoLegend() {
  return (
    <Container fluid>
      <Row>
        {sampleStatus.map((status) => {
          const colors = sampleStatusColors[status];
          return (
            <Col key={status} xs={'auto'} s>
              <div
                style={{
                  border: `${colors.border === 'black' ? 1 : 4}px solid ${
                    colors.border
                  }`,
                  paddingLeft: 5,
                  paddingRight: 5,
                  backgroundColor: colors.background,
                  color: colors.color,
                  borderRadius: 5,
                  height: 35,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <small>{status}</small>
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export function ShippingInfo({
  sessionId,
  proposalName,
  shippingId,
  dataCollectionGroups,
}: {
  sessionId: string;
  proposalName: string;
  shippingId: number;
  dataCollectionGroups: DataCollectionGroup[];
}) {
  const { data: shipping } = useShipping({
    proposalName,
    shippingId,
  });

  if (!shipping) return null;

  return (
    <div style={{ marginBottom: '1rem', padding: 10 }}>
      <Col>
        <Row>
          <strong>Shipping {shipping.shippingName}</strong>
          {_(shipping.dewarVOs)
            .sortBy((d) => d.barCode)
            .value()
            .map((dewar) => (
              <DewarInfo
                key={dewar.dewarId}
                dewar={dewar}
                dataCollectionGroups={dataCollectionGroups}
              />
            ))}
        </Row>
      </Col>
    </div>
  );
}

export function DewarInfo({
  dewar,
  dataCollectionGroups,
}: {
  dewar: ShippingDewar;
  dataCollectionGroups: DataCollectionGroup[];
}) {
  return (
    <Container fluid>
      <div
        style={{
          marginBottom: 5,
          marginTop: 5,
          backgroundColor: 'lightgrey',
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Col>
          <Row>
            <strong>Dewar {dewar.barCode}</strong>
          </Row>
          <Row>
            {_(dewar.containerVOs)
              .sortBy((c) => c.code)
              .value()
              .map((container) => (
                <ContainerInfo
                  key={container.containerId}
                  container={container}
                  dataCollectionGroups={dataCollectionGroups}
                />
              ))}
          </Row>
        </Col>
      </div>
    </Container>
  );
}

export function ContainerInfo({
  container,
  dataCollectionGroups,
}: {
  container: ShippingContainer;
  dataCollectionGroups: DataCollectionGroup[];
}) {
  return (
    <Container fluid>
      <div
        style={{
          borderBottom: '1px solid grey',
          marginTop: 5,
          marginBottom: 5,
        }}
      />

      <div style={{ marginTop: 5 }}>
        <Col>
          <Row>
            <Col xs={'auto'}>
              <i style={{ width: 100, display: 'block' }}>
                Puck {container.code}
              </i>
            </Col>
            <Col>
              <Row>
                {_(container.sampleVOs)
                  .sortBy((c) => Number(c.location))
                  .value()
                  .map((sample) => (
                    <Col
                      xs={'auto'}
                      key={sample.blSampleId}
                      style={{ padding: 5 }}
                    >
                      <SampleInfo
                        key={sample.blSampleId}
                        sample={sample}
                        dataCollectionGroups={dataCollectionGroups}
                      />
                    </Col>
                  ))}
              </Row>
            </Col>
          </Row>
        </Col>
      </div>
    </Container>
  );
}

const sampleStatus = [
  'untouched',
  'collected',
  'processed',
  'phasing',
] as const;
type SampleStatus = typeof sampleStatus[number];

function getSampleStatus(
  sample: ShippingSample,
  dataCollectionGroups: DataCollectionGroup[]
): SampleStatus {
  const dcs = dataCollectionGroups.filter(
    (dcg) => dcg.BLSample_blSampleId === sample.blSampleId
  );
  const collected = !!dcs.length;

  const processed = dcs.some((dcg) =>
    dcg.AutoProcProgram_processingStatus?.includes('SUCCESS')
  );

  const phasing = dcs.some((dcg) => dcg.hasPhasing || dcg.hasMR);

  if (phasing) {
    return 'phasing';
  } else if (processed) {
    return 'processed';
  } else if (collected) {
    return 'collected';
  } else {
    return 'untouched';
  }
}

const sampleStatusColors: Record<
  SampleStatus,
  {
    background: string;
    color: string;
    border: string;
  }
> = {
  untouched: {
    background: 'orange',
    color: 'black',
    border: 'black',
  },
  collected: {
    background: '#7eaf7e',
    color: 'black',
    border: 'black',
  },
  processed: {
    background: '#7eaf7e',
    color: 'black',
    border: 'blue',
  },
  phasing: {
    background: '#7eaf7e',
    color: 'black',
    border: 'yellow',
  },
};

export function SampleInfo({
  sample,
  dataCollectionGroups,
}: {
  sample: ShippingSample;
  dataCollectionGroups: DataCollectionGroup[];
}) {
  const status = getSampleStatus(sample, dataCollectionGroups);

  const colors = sampleStatusColors[status];

  return (
    <div
      style={{
        backgroundColor: colors.background,
        height: 30,
        width: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `${colors.border === 'black' ? 1 : 4}px solid ${colors.border}`,
        borderRadius: 15,
        color: colors.color,
      }}
    >
      <small className="text-center">{sample.location}</small>
    </div>
  );
}
