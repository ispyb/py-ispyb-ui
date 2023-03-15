import Loading from 'components/Loading';
import { useAutoProcRanking, usePipelines } from 'hooks/mx';
import {
  AutoProcIntegration,
  compareRankingValues,
  getRankedResults,
  getRankingOrder,
  getRankingValue,
} from 'legacy/helpers/mx/results/resultparser';
import {
  useAutoProc,
  useMXDataCollectionsBy,
  useShipping,
} from 'legacy/hooks/ispyb';
import {
  ShippingContainer,
  ShippingDewar,
  ShippingSample,
} from 'legacy/pages/shipping/model';
import _ from 'lodash';
import { Suspense } from 'react';
import {
  Alert,
  Badge,
  Col,
  Container,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';
import BestResultSection from '../datacollectiongroup/summarydatacollectiongroup/autoprocintegrationsection';
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

  const pipelines = usePipelines();
  const ranking = useAutoProcRanking();

  const dcIds = _.uniq(
    (dataCollectionGroups || []).map(
      (dcg) => dcg.DataCollection_dataCollectionId
    )
  )
    .sort()
    .join(',');

  const { data: integrations } = useAutoProc({
    proposalName,
    dataCollectionId: dcIds,
  });

  const rankedIntegrations = getRankedResults(
    integrations?.flatMap((d) => d) || [],
    ranking.rankShell,
    ranking.rankParam,
    pipelines.pipelines,
    true
  );

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
        <ShippingInfoLegend
          dataCollectionGroups={dataCollectionGroups || []}
          proposalName={proposalName}
          rankedIntegrations={rankedIntegrations}
        />
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
                    rankedIntegrations={rankedIntegrations}
                  />
                </Suspense>
              )
          )}
      </Col>
    </Container>
  );
}

export function ShippingInfoLegend({
  dataCollectionGroups,
  proposalName,
  rankedIntegrations,
}: {
  dataCollectionGroups: DataCollectionGroup[];
  proposalName: string;
  rankedIntegrations: AutoProcIntegration[];
}) {
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
              {colors.underline && (
                <div
                  style={{
                    backgroundColor: 'yellow',
                    height: 5,
                    border: `1px solid black`,
                    borderRadius: 3,
                    marginTop: 2,
                  }}
                />
              )}
            </Col>
          );
        })}
      </Row>
      <Row>
        <div style={{ marginTop: 10, maxWidth: 500 }}>
          <ColorScale rankedIntegrations={rankedIntegrations} />
        </div>
      </Row>
    </Container>
  );
}

export function ShippingInfo({
  sessionId,
  proposalName,
  shippingId,
  dataCollectionGroups,
  rankedIntegrations,
}: {
  sessionId: string;
  proposalName: string;
  shippingId: number;
  dataCollectionGroups: DataCollectionGroup[];
  rankedIntegrations: AutoProcIntegration[];
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
                rankedIntegrations={rankedIntegrations}
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
  rankedIntegrations,
}: {
  dewar: ShippingDewar;
  dataCollectionGroups: DataCollectionGroup[];
  rankedIntegrations: AutoProcIntegration[];
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
                  rankedIntegrations={rankedIntegrations}
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
  rankedIntegrations,
}: {
  container: ShippingContainer;
  dataCollectionGroups: DataCollectionGroup[];
  rankedIntegrations: AutoProcIntegration[];
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
                        rankedIntegrations={rankedIntegrations}
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
  'not collected',
  'collected',
  'processed',
  'phasing',
] as const;
type SampleStatus = typeof sampleStatus[number];

function getSampleStatus(
  sample: ShippingSample,
  dataCollectionGroups: DataCollectionGroup[],
  rankedIntegrations: AutoProcIntegration[]
): SampleStatus {
  const dcs = dataCollectionGroups.filter(
    (dcg) => dcg.BLSample_blSampleId === sample.blSampleId
  );
  const collected = !!dcs.length;

  const dcsIds = dcs.map((dcg) => dcg.DataCollection_dataCollectionId);

  const bestIntegration = rankedIntegrations.find((r) =>
    dcsIds.includes(r.dataCollectionId)
  );

  const processed = bestIntegration !== undefined;

  const phasing = dcs.some((dcg) => dcg.hasPhasing || dcg.hasMR);

  if (phasing) {
    return 'phasing';
  } else if (processed) {
    return 'processed';
  } else if (collected) {
    return 'collected';
  } else {
    return 'not collected';
  }
}

const sampleStatusColors: Record<
  SampleStatus,
  {
    background: string;
    color: string;
    border: string;
    underline?: boolean;
  }
> = {
  'not collected': {
    background: '#d4e4bc',
    color: 'black',
    border: 'black',
  },
  collected: {
    background: '#36558f',
    color: 'white',
    border: 'black',
  },
  processed: {
    background: '#36558f',
    color: 'white',
    border: 'green',
  },
  phasing: {
    background: '#36558f',
    color: 'white',
    border: 'black',
    underline: true,
  },
};

export function SampleInfo({
  sample,
  dataCollectionGroups,
  rankedIntegrations,
}: {
  sample: ShippingSample;
  dataCollectionGroups: DataCollectionGroup[];
  rankedIntegrations: AutoProcIntegration[];
}) {
  const status = getSampleStatus(
    sample,
    dataCollectionGroups,
    rankedIntegrations
  );

  const colors = sampleStatusColors[status];

  const ranking = useAutoProcRanking();

  const values = rankedIntegrations.map((r) =>
    getRankingValue(r, ranking.rankShell, ranking.rankParam)
  );

  const valuesWithoutUndefined: number[] = [];
  values.forEach((v) => {
    if (v !== undefined) {
      valuesWithoutUndefined.push(v);
    }
  });

  const sortedValues = valuesWithoutUndefined.sort((a, b) =>
    compareRankingValues(a, b, ranking.rankParam)
  );

  const bestOverall = sortedValues[0];
  const worstOverall = sortedValues[sortedValues.length - 1];

  const dcs = dataCollectionGroups.filter(
    (dcg) => dcg.BLSample_blSampleId === sample.blSampleId
  );
  const dcsIds = dcs.map((dcg) => dcg.DataCollection_dataCollectionId);

  const bestIntegration = rankedIntegrations.find((r) =>
    dcsIds.includes(r.dataCollectionId)
  );

  const value = bestIntegration
    ? getRankingValue(bestIntegration, ranking.rankShell, ranking.rankParam)
    : undefined;

  const order = getRankingOrder(ranking.rankParam);

  const min = order === 1 ? bestOverall : worstOverall;
  const max = order === 1 ? worstOverall : bestOverall;
  const minColor =
    order === 1
      ? { red: 0, green: 255, blue: 0 }
      : { red: 255, green: 0, blue: 0 };
  const maxColor =
    order === 1
      ? { red: 255, green: 0, blue: 0 }
      : { red: 0, green: 255, blue: 0 };

  const color = value
    ? ColourGradient(min, max, value, minColor, maxColor)
    : undefined;

  const border = color
    ? `rgb(${color.red},${color.green},${color.blue})`
    : colors.border;

  const popover = (
    <Popover
      id="popover-basic"
      style={{ minWidth: bestIntegration ? 500 : undefined }}
    >
      <Popover.Header as="h3">
        {sample.name}
        <Badge>{status}</Badge>
      </Popover.Header>
      {
        <Popover.Body>
          <i>
            {`${dcs.length} collection${
              dcs.length === 1 ? '' : 's'
            } for this sample`}
          </i>
          {value && (
            <>
              <br />
              <strong>
                {ranking.rankShell} {ranking.rankParam} = {value}
              </strong>
            </>
          )}
          {bestIntegration && (
            <div>
              <br />
              <BestResultSection bestResult={bestIntegration} compact={false} />
            </div>
          )}
        </Popover.Body>
      }
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger={['hover', 'focus']}
      placement="auto"
      overlay={popover}
    >
      <>
        <div
          style={{
            backgroundColor: colors.background,
            height: 30,
            width: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `${border === 'black' ? 1 : 4}px solid ${border}`,
            borderRadius: 15,
            color: colors.color,
          }}
        >
          <small className="text-center">{sample.location}</small>
        </div>
        {colors.underline && (
          <div
            style={{
              backgroundColor: 'yellow',
              height: 5,
              border: `1px solid black`,
              borderRadius: 3,
              marginTop: 2,
            }}
          />
        )}
      </>
    </OverlayTrigger>
  );
}

export function ColorScale({
  rankedIntegrations,
}: {
  rankedIntegrations: AutoProcIntegration[];
}) {
  const ranking = useAutoProcRanking();

  const values = rankedIntegrations.map((r) =>
    getRankingValue(r, ranking.rankShell, ranking.rankParam)
  );

  const valuesWithoutUndefined: number[] = [];
  values.forEach((v) => {
    if (v !== undefined) {
      valuesWithoutUndefined.push(v);
    }
  });

  const sortedValues = valuesWithoutUndefined.sort((a, b) =>
    compareRankingValues(a, b, ranking.rankParam)
  );

  const best = sortedValues[0];
  const worst = sortedValues[sortedValues.length - 1];

  const width = 100;
  return (
    <div>
      <div
        style={{
          height: 20,
          position: 'relative',
          border: '1px solid black',
          borderRadius: 5,
          overflow: 'hidden',
        }}
      >
        {_.range(0, width).map((x) => {
          const color = ColourGradient(
            0,
            width,
            x,
            { red: 0, green: 255, blue: 0 },
            { red: 255, green: 0, blue: 0 }
          );
          return (
            <div
              key={x}
              style={{
                position: 'absolute',
                left: (x / width) * 100 + '%',
                top: 0,
                bottom: 0,
                width: 100 / width + 0.01 + '%',
                backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          height: 20,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>{best}</div>
          <div>
            {ranking.rankShell} {ranking.rankParam}
          </div>
          <div>{worst}</div>
        </div>
      </div>
    </div>
  );
}

/** Valid values are from 0 to 255 (inclusive) */
export interface Colour {
  red: number;
  blue: number;
  green: number;
}

/** Calculates an intermediary colour between 2 or 3 colours.
 * @returns {Colour} Object with red, green, and blue number fields.
 * @example -> {red: 123, blue: 255, green: 0}
 */
export default function ColourGradient(
  min: number,
  max: number,
  current: number,
  colorA: Colour,
  colorB: Colour,
  colorC?: Colour
): Colour {
  let color_progression;
  if (current >= max) color_progression = 1;
  else color_progression = (current - min) / (max - min); // Standardize as decimal [0-1 (inc)].
  if (colorC) {
    color_progression *= 2;
    if (color_progression >= 1) {
      color_progression -= 1;
      colorA = colorB;
      colorB = colorC;
    }
  }

  const newRed = colorA.red + color_progression * (colorB.red - colorA.red);
  const newGreen =
    colorA.green + color_progression * (colorB.green - colorA.green);
  const newBlue = colorA.blue + color_progression * (colorB.blue - colorA.blue);

  const red = Math.floor(newRed);
  const green = Math.floor(newGreen);
  const blue = Math.floor(newBlue);

  return { red, green, blue };
}
