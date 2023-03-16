import Loading from 'components/Loading';
import { useAutoProcRanking, usePipelines } from 'hooks/mx';
import { usePersistentParamState } from 'hooks/useParam';
import { getDozorPlot } from 'legacy/api/ispyb';
import ZoomImage from 'legacy/components/image/zoomimage';
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
  Button,
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

  const dcIds = _(dataCollectionGroups || [])
    .filter(
      (dcg) =>
        dcg.AutoProcProgram_processingPrograms !== undefined &&
        dcg.AutoProcProgram_processingPrograms.length > 0
    )
    .map((dcg) => dcg.DataCollection_dataCollectionId)
    .uniq()
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

  const proteins = [
    'All',
    ..._(dataCollectionGroups || [])
      .map((dcg) => dcg.Protein_acronym)
      .uniq()
      .sort()
      .value(),
  ];

  const [proteinFilter, setProteinFilter] = usePersistentParamState<string>(
    'protein',
    'All'
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
        <Container fluid style={{ marginBottom: '1rem' }}>
          <Row>
            <Col xs={'auto'} style={{ display: 'flex', alignItems: 'center' }}>
              <strong>Filter by target:</strong>
            </Col>
            {proteins.map((p) => {
              return (
                <Col key={p} xs={'auto'}>
                  <Button
                    size="sm"
                    variant={
                      p === proteinFilter ? 'primary' : 'outline-primary'
                    }
                    onClick={() => {
                      setProteinFilter(p);
                    }}
                  >
                    {p}
                  </Button>
                </Col>
              );
            })}
          </Row>
          <div style={{ borderBottom: '1px solid grey', marginTop: '1rem' }} />
        </Container>
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
                    proteinFilter={proteinFilter}
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
        <Col xs={'auto'} style={{ display: 'flex', alignItems: 'center' }}>
          <strong>Legend:</strong>
        </Col>
        {sampleStatus.map((status) => {
          const colors = getSampleColors([status, 'collected']);
          return (
            <Col key={status} xs={'auto'}>
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
  proteinFilter,
}: {
  sessionId: string;
  proposalName: string;
  shippingId: number;
  dataCollectionGroups: DataCollectionGroup[];
  rankedIntegrations: AutoProcIntegration[];
  proteinFilter: string;
}) {
  const { data: shipping } = useShipping({
    proposalName,
    shippingId,
  });

  if (!shipping) return null;

  const samples = _(shipping.dewarVOs)
    .flatMap((d) => d.containerVOs)
    .flatMap((d) => d.sampleVOs)
    .value();

  const onlyOneDewar = shipping.dewarVOs.length === 1;

  return (
    <div style={{ marginBottom: '1rem', padding: 10 }}>
      <Col>
        <Row>
          <strong>Shipping {shipping.shippingName}</strong>
        </Row>
        <Row>
          <SamplesStatistics
            samples={samples}
            dataCollectionGroups={dataCollectionGroups}
            rankedIntegrations={rankedIntegrations}
          />
        </Row>
        <Row>
          {_(shipping.dewarVOs)
            .sortBy((d) => d.barCode)
            .value()
            .map((dewar) => (
              <DewarInfo
                key={dewar.dewarId}
                dewar={dewar}
                dataCollectionGroups={dataCollectionGroups}
                rankedIntegrations={rankedIntegrations}
                onlyOneDewar={onlyOneDewar}
                proteinFilter={proteinFilter}
                proposalName={proposalName}
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
  onlyOneDewar = false,
  proteinFilter,
  proposalName,
}: {
  dewar: ShippingDewar;
  dataCollectionGroups: DataCollectionGroup[];
  rankedIntegrations: AutoProcIntegration[];
  onlyOneDewar?: boolean;
  proteinFilter: string;
  proposalName: string;
}) {
  const samples = _(dewar.containerVOs)
    .flatMap((d) => d.sampleVOs)
    .value();

  const onlyOnePuck = dewar.containerVOs.length === 1;

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
          {!onlyOneDewar && (
            <SamplesStatistics
              samples={samples}
              dataCollectionGroups={dataCollectionGroups}
              rankedIntegrations={rankedIntegrations}
            />
          )}
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
                  onlyOnePuck={onlyOnePuck}
                  proteinFilter={proteinFilter}
                  proposalName={proposalName}
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
  onlyOnePuck = false,
  proteinFilter,
  proposalName,
}: {
  container: ShippingContainer;
  dataCollectionGroups: DataCollectionGroup[];
  rankedIntegrations: AutoProcIntegration[];
  onlyOnePuck?: boolean;
  proteinFilter: string;
  proposalName: string;
}) {
  const samples = container.sampleVOs;

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
              <i>Puck {container.code}</i>
            </Col>
            <Col xs={'auto'}>
              {!onlyOnePuck && (
                <SamplesStatistics
                  samples={samples}
                  dataCollectionGroups={dataCollectionGroups}
                  rankedIntegrations={rankedIntegrations}
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <Row style={{ paddingLeft: 10, paddingRight: 10 }}>
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
                        proteinFilter={proteinFilter}
                        proposalName={proposalName}
                      />
                    </Col>
                  ))}
              </Row>
            </Col>
          </Row>
          <Row></Row>
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

function getSampleStatuses(
  sample: ShippingSample,
  dataCollectionGroups: DataCollectionGroup[],
  rankedIntegrations: AutoProcIntegration[]
): SampleStatus[] {
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

  const res: SampleStatus[] = [];

  if (phasing) {
    res.push('phasing');
  }
  if (processed) {
    res.push('processed');
  }
  if (collected) {
    res.push('collected');
  } else {
    res.push('not collected');
  }
  return res;
}

const sampleStatusColors: Record<
  SampleStatus,
  {
    background?: string;
    color?: string;
    border?: string;
    underline?: boolean;
  }
> = {
  'not collected': {
    background: '#d4e4bc',
    color: 'black',
  },
  collected: {
    background: '#36558f',
    color: 'white',
  },
  processed: {
    border: 'green',
  },
  phasing: {
    underline: true,
  },
};

function getSampleColors(statuses: SampleStatus[]) {
  const colors = statuses.map((s) => sampleStatusColors[s]);
  const background =
    colors.map((c) => c.background).filter((c) => c !== undefined)[0] ||
    'white';
  const color =
    colors.map((c) => c.color).filter((c) => c !== undefined)[0] || 'black';
  const border =
    colors.map((c) => c.border).filter((c) => c !== undefined)[0] || 'black';
  const underline = colors.some((c) => c.underline);
  return { background, color, border, underline };
}

export function SamplesStatistics({
  samples,
  dataCollectionGroups,
  rankedIntegrations,
}: {
  samples: ShippingSample[];
  dataCollectionGroups: DataCollectionGroup[];
  rankedIntegrations: AutoProcIntegration[];
}) {
  const statuses = _(samples)
    .map((s) => getSampleStatuses(s, dataCollectionGroups, rankedIntegrations))
    .value();
  const proteins = _(samples)
    .map((s) => s.crystalVO?.proteinVO.acronym)
    .uniq()
    .sort()
    .value();
  return (
    <Row>
      <Col xs={'auto'}>
        <small>
          <i>
            <strong>total samples:</strong> {samples.length}
          </i>
        </small>
      </Col>
      {sampleStatus.map((s) => {
        const nb = statuses.filter((st) => st.includes(s)).length;
        return (
          <Col xs={'auto'} key={s}>
            <small>
              <i>
                <strong>{s}:</strong> {nb}
              </i>
            </small>
          </Col>
        );
      })}
      <Col xs={'auto'}>
        <small>
          <i>
            <strong>Protein{proteins.length > 1 ? 's' : ''}: </strong>
          </i>
          {proteins.map((p) => (
            <Badge bg="info" key={p}>
              {p}
            </Badge>
          ))}
        </small>
      </Col>
    </Row>
  );
}

export function SampleInfo({
  sample,
  dataCollectionGroups,
  rankedIntegrations,
  proteinFilter,
  proposalName,
}: {
  sample: ShippingSample;
  dataCollectionGroups: DataCollectionGroup[];
  rankedIntegrations: AutoProcIntegration[];
  proteinFilter: string;
  proposalName: string;
}) {
  const proteinEnabled =
    proteinFilter === 'All' ||
    proteinFilter === sample.crystalVO?.proteinVO.acronym;

  const statuses = getSampleStatuses(
    sample,
    dataCollectionGroups,
    rankedIntegrations
  );

  const colors = getSampleColors(statuses);

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
        <strong>Sample: </strong>
        {sample.name}
        <br />
        <strong>Protein: </strong>
        {sample.crystalVO?.proteinVO.acronym || 'unknown protein'}
      </Popover.Header>

      <Popover.Body>
        {statuses.map((status) => (
          <Badge style={{ marginLeft: 0, marginRight: 10 }} key={status}>
            {status}
          </Badge>
        ))}
        <br />
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
        {bestIntegration?.dataCollectionId && (
          <ZoomImage
            style={{ maxWidth: 500, minHeight: 350 }}
            alt="Dozor"
            src={
              getDozorPlot({
                proposalName,
                dataCollectionId: bestIntegration?.dataCollectionId,
              }).url
            }
          ></ZoomImage>
        )}
      </Popover.Body>
    </Popover>
  );

  const disabledColor = '#b5b5b5';

  return (
    <>
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="auto"
        overlay={popover}
      >
        <div
          style={{
            backgroundColor: proteinEnabled ? colors.background : disabledColor,
            height: 30,
            width: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `${border === 'black' ? 1 : 4}px solid ${
              proteinEnabled ? border : 'grey'
            }`,
            borderRadius: 15,
            color: colors.color,
          }}
        >
          <small className="text-center">{sample.location}</small>
        </div>
      </OverlayTrigger>
      {colors.underline && (
        <div
          style={{
            backgroundColor: proteinEnabled ? 'yellow' : disabledColor,
            height: 5,
            border: `1px solid black`,
            borderRadius: 3,
            marginTop: 2,
          }}
        />
      )}
    </>
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
