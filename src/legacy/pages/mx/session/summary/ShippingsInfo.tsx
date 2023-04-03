import Loading from 'components/Loading';
import { useAutoProcRanking, usePipelines } from 'hooks/mx';
import { usePersistentParamState } from 'hooks/useParam';
import { getDozorPlot } from 'legacy/api/ispyb';
import ZoomImage from 'legacy/components/image/zoomimage';
import { isDataset } from 'legacy/helpers/mx/isDataset';
import {
  AutoProcIntegration,
  getRankedResults,
  getRankingValue,
} from 'legacy/helpers/mx/results/resultparser';
import { getBeamline, getSampleChanger } from 'legacy/helpers/mx/samplehelper';
import {
  useAutoProc,
  useMXDataCollectionsBy,
  useShipping,
} from 'legacy/hooks/ispyb';
import { useBeamlinesObjects } from 'legacy/hooks/site';
import {
  ShippingContainer,
  ShippingDewar,
  ShippingSample,
} from 'legacy/pages/shipping/model';
import _ from 'lodash';
import { Suspense, useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Form,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BestAutoprocResult } from '../../dataset/datacollectiongroup/summary/BestAutoprocResult';
import { DataCollectionGroup } from '../../model';

import {
  percentToScaleValue,
  ProcColorScaleInformation,
  scaleValueToPercent,
  useProcColorScale,
} from './ProcColourScale';

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
    dataCollectionId: dcIds || 'none',
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
      .filter((p) => p !== undefined)
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
            <Alert variant="info">No shipment found</Alert>
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
  rankedIntegrations,
}: {
  dataCollectionGroups: DataCollectionGroup[];
  proposalName: string;
  rankedIntegrations: AutoProcIntegration[];
}) {
  return (
    <Container fluid>
      <Row>
        <strong>Legend:</strong>
      </Row>
      <Row>
        <Container fluid>
          <Col
            style={{
              marginTop: 10,
              maxWidth: 800,
              backgroundColor: '#EEEEEE',
              paddingTop: 10,
              paddingLeft: 10,
              paddingRight: 10,
              border: '1px solid lightgrey',
              borderRadius: 5,
            }}
          >
            <Row style={{ paddingTop: 10 }}>
              <ContainerColors />
            </Row>
            <Row style={{ padding: 20 }}>
              <div style={{ borderTop: '1px solid lightgrey' }} />
            </Row>
            <Row>
              <ColorScale rankedIntegrations={rankedIntegrations} />
            </Row>
          </Col>
        </Container>
      </Row>
    </Container>
  );
}

export function ContainerColors() {
  return (
    <Row>
      <Col xs={'auto'} style={{ display: 'flex', alignItems: 'center' }}>
        <strong>Samples:</strong>
      </Col>
      {sampleStatus.map((status) => {
        const colors = getSampleColors([status, 'dataset']);
        return (
          <Col key={status} xs={'auto'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div
                style={{
                  border: `${colors.border === 'black' ? 1 : 4}px solid ${
                    colors.border
                  }`,
                  backgroundColor: colors.background,
                  color: colors.color,
                  borderRadius: 15,
                  height: 30,
                  width: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <small>1</small>
                {colors.underline && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -8,
                      backgroundColor: 'yellow',
                      height: 5,
                      width: 30,
                      border: `1px solid black`,
                      borderRadius: 3,
                      marginTop: 2,
                    }}
                  />
                )}
              </div>
              <i>{status}</i>
            </div>
          </Col>
        );
      })}
    </Row>
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

  if (!shipping.dewarVOs.length) return null;

  return (
    <div style={{ marginBottom: '1rem', padding: 10 }}>
      <Col>
        <Row>
          <strong>Shipment {shipping.shippingName}</strong>
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

  if (!dewar.containerVOs.length) return null;

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

  const beamlines = useBeamlinesObjects('MX');

  const beamline = getBeamline(beamlines, container.beamlineLocation || '');

  const changer = getSampleChanger(beamline?.sampleChangerType);

  const pos = container.sampleChangerLocation
    ? changer?.getPosition(Number(container.sampleChangerLocation))
    : undefined;
  const posStr = pos ? `${pos.cell + 1}-${pos.position + 1}` : '';
  if (!samples.length) return null;

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
              <i>
                Puck {container.code}
                {pos ? <strong> [Mounted at {posStr}]</strong> : ''}
              </i>
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
  'not analysed',
  'analysed',
  'dataset',
  'autoprocessed',
  'phased',
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

  const dataset = dcs.some(isDataset);

  const dcsIds = dcs.map((dcg) => dcg.DataCollection_dataCollectionId);

  const bestIntegration = rankedIntegrations.find((r) =>
    dcsIds.includes(r.dataCollectionId)
  );

  const processed = bestIntegration !== undefined;

  const phasing = dcs.some((dcg) => dcg.hasPhasing || dcg.hasMR);

  const res: SampleStatus[] = [];

  if (phasing) {
    res.push('phased');
  }
  if (processed) {
    res.push('autoprocessed');
  }
  if (dataset) {
    res.push('dataset');
  }
  if (collected) {
    res.push('analysed');
  } else {
    res.push('not analysed');
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
  'not analysed': {
    background: 'white',
    color: 'black',
  },
  analysed: {
    background: '#a9ddff',
    color: 'black',
  },
  dataset: {
    background: '#36558f',
    color: 'white',
  },
  autoprocessed: {
    border: 'rgb(0,255,0)',
  },
  phased: {
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
            <strong>Samples shipped:</strong> {samples.length}
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

  const navigate = useNavigate();

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

  const scale = useProcColorScale(rankedIntegrations);

  const border = value ? scale.getColor(value) : colors.border;

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
            <BestAutoprocResult bestResult={bestIntegration} />
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

  const onClick = () => {
    navigate(`../collection?filterSamples=true&samples=${sample.name}`);
  };
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
            cursor: 'pointer',
          }}
          onClick={onClick}
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
  const scale = useProcColorScale(rankedIntegrations);

  const width = 800;

  const [currentBestScale, setCurrentBestScale] = useState<number>(
    scale.scaleBest
  );
  const [currentWorstScale, setCurrentWorstScale] = useState<number>(
    scale.scaleWorst
  );

  const [currentWorstScaleText, setCurrentWorstScaleText] = useState<string>(
    currentWorstScale.toFixed(2)
  );
  const isValidBestScale = (v: number) => {
    const percent = scaleValueToPercent(v, scale);
    const currentWorstPercent = scaleValueToPercent(currentWorstScale, scale);
    return percent >= currentWorstPercent && percent <= 100;
  };
  const isValidWorstScale = (v: number) => {
    const percent = scaleValueToPercent(v, scale);
    const currentBestPercent = scaleValueToPercent(currentBestScale, scale);
    return percent <= currentBestPercent && percent >= 0;
  };

  const [currentBestScaleText, setCurrentBestScaleText] = useState<string>(
    currentBestScale.toFixed(2)
  );

  const updateCurrentBestScale = (v: number) => {
    setCurrentBestScaleText(v.toFixed(2));
    setCurrentBestScale(v);
  };
  const updateCurrentWorstScale = (v: number) => {
    setCurrentWorstScaleText(v.toFixed(2));
    setCurrentWorstScale(v);
  };

  useEffect(() => {
    updateCurrentBestScale(scale.scaleBest);
    updateCurrentWorstScale(scale.scaleWorst);
  }, [scale.scaleBest, scale.scaleWorst]);

  return (
    <div>
      <strong>Processing indicator:</strong>
      {/* Min/max and parameter display */}
      <div
        style={{
          left: 0,
          top: 0,
          bottom: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div>{scale.worst.toFixed(2)}</div>
        <div>
          {scale.ranking.rankShell} {scale.ranking.rankParam}
        </div>
        <div>{scale.best.toFixed(2)}</div>
      </div>
      {/* Scale */}
      <div
        style={{
          position: 'relative',
        }}
        onDragOver={(e) => {
          const type = e.dataTransfer.getData('type');
          if (type === 'best' || type === 'worst') {
            e.preventDefault();
            const parent = e.currentTarget as HTMLElement;
            const rect = parent.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = (x / rect.width) * 100;
            const value = percentToScaleValue(percent, scale);
            if (type === 'best') {
              updateCurrentBestScale(value);
            }
            if (type === 'worst') {
              updateCurrentWorstScale(value);
            }
          }
        }}
      >
        <div
          style={{
            height: 30,
            position: 'relative',
            border: '1px solid black',
            borderRadius: 5,
            overflow: 'hidden',
          }}
        >
          {_.range(0, width).map((x) => {
            const percent = (x / width) * 100;
            const nextPercent = ((x + 1) / width) * 100;
            const value = percentToScaleValue(percent, scale);
            const color = scale.getColor(
              value,
              currentWorstScale,
              currentBestScale,
              true
            );
            return (
              <div
                key={x}
                style={{
                  position: 'absolute',
                  left: percent + '%',
                  right: 100 - nextPercent + '%',
                  top: 0,
                  bottom: 0,
                  backgroundColor: color,
                }}
              />
            );
          })}
        </div>

        {/* cursors */}
        <ScaleCursor
          type={'best'}
          scale={scale}
          currentValue={currentBestScale}
          setCurrentValue={updateCurrentBestScale}
          limitUp={100}
          limitDown={scaleValueToPercent(currentWorstScale, scale) + 1}
        />
        <ScaleCursor
          type={'worst'}
          scale={scale}
          currentValue={currentWorstScale}
          setCurrentValue={updateCurrentWorstScale}
          limitUp={scaleValueToPercent(currentBestScale, scale) - 1}
          limitDown={0}
        />
      </div>
      {/* Scale cursor values */}
      <div style={{ position: 'relative', height: 40 }}>
        <div
          style={{
            position: 'absolute',
            left: scaleValueToPercent(currentWorstScale, scale) + '%',
            transform:
              scaleValueToPercent(currentBestScale, scale) -
                scaleValueToPercent(currentWorstScale, scale) <=
              10
                ? 'translateX(-100%)'
                : 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'row',
            top: 2,
            alignItems: 'center',
          }}
        >
          <Form.Control
            size="sm"
            className="text-center"
            value={currentWorstScaleText}
            style={{
              width: `${currentWorstScaleText.toString().length + 3}ch`,
            }}
            onInput={(e) => {
              setCurrentWorstScaleText(
                e.currentTarget.value.replaceAll(/[^0-9.-]/g, '')
              );
            }}
          ></Form.Control>
          {currentWorstScaleText !== currentWorstScale.toFixed(2) && (
            <>
              {Number.isNaN(parseFloat(currentWorstScaleText)) ||
              !isValidWorstScale(parseFloat(currentWorstScaleText)) ? (
                <span style={{ color: 'red' }}>Invalid</span>
              ) : (
                <Button
                  style={{ padding: 0 }}
                  variant="link"
                  onClick={() => {
                    const value = parseFloat(currentWorstScaleText);
                    if (!isNaN(value)) {
                      updateCurrentWorstScale(value);
                      scale.setScaleWorst(value);
                    }
                  }}
                >
                  Set
                </Button>
              )}
            </>
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            left: scaleValueToPercent(currentBestScale, scale) + '%',
            transform:
              scaleValueToPercent(currentBestScale, scale) -
                scaleValueToPercent(currentWorstScale, scale) <=
              10
                ? 'translateX(0%)'
                : 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'row',
            top: 2,
            alignItems: 'center',
          }}
        >
          <Form.Control
            size="sm"
            className="text-center"
            value={currentBestScaleText}
            style={{
              width: `${currentBestScaleText.toString().length + 3}ch`,
            }}
            onInput={(e) => {
              setCurrentBestScaleText(
                e.currentTarget.value.replaceAll(/[^0-9.-]/g, '')
              );
            }}
          ></Form.Control>
          {currentBestScaleText !== currentBestScale.toFixed(2) && (
            <>
              {Number.isNaN(parseFloat(currentBestScaleText)) ||
              !isValidBestScale(parseFloat(currentBestScaleText)) ? (
                <span style={{ color: 'red' }}>Invalid</span>
              ) : (
                <Button
                  style={{ padding: 0 }}
                  variant="link"
                  onClick={() => {
                    const value = parseFloat(currentBestScaleText);
                    if (!isNaN(value)) {
                      updateCurrentBestScale(value);
                      scale.setScaleBest(value);
                    }
                  }}
                >
                  Set
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: -15,
        }}
      >
        <Button variant="link" onClick={() => scale.resetScale()}>
          Reset color scale to defaults
        </Button>
      </div>
    </div>
  );
}

//Preload empty image to put as drag image for the cursors
const dragImg = document.createElement('img');
dragImg.src =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function ScaleCursor({
  type,
  scale,
  currentValue,
  setCurrentValue,
  limitUp,
  limitDown,
}: {
  type: 'best' | 'worst';
  scale: ProcColorScaleInformation;
  currentValue: number;
  setCurrentValue: (v: number) => void;
  limitUp: number;
  limitDown: number;
}) {
  const position = scaleValueToPercent(currentValue, scale);

  const handleMove = (parent: HTMLElement, x: number) => {
    const parentRect = parent.getBoundingClientRect();
    const parentLeft = parentRect.left;
    const parentRight = parentRect.right;
    const parentWidth = parentRight - parentLeft;
    const newX = x - parentLeft;
    const percent = (newX / parentWidth) * 100;
    const correctedPercent = Math.min(limitUp, Math.max(limitDown, percent));
    const scaleValue = percentToScaleValue(correctedPercent, scale);
    setCurrentValue(scaleValue);
  };
  const handleFinished = () => {
    if (type === 'best') {
      scale.setScaleBest(currentValue);
    } else {
      scale.setScaleWorst(currentValue);
    }
  };

  return (
    <div
      style={{
        paddingLeft: 5,
        paddingRight: 5,
        position: 'absolute',
        left: position + '%',
        transform: 'translateX(-50%)',
        top: -5,
        bottom: -5,
        zIndex: Number.MAX_SAFE_INTEGER,
        cursor: 'ew-resize',
      }}
      draggable="true"
      onTouchMove={(e) => {
        if (!e.currentTarget.parentNode) {
          return;
        }
        if (!(e.currentTarget.parentNode instanceof HTMLElement)) {
          return;
        }
        const x = e.touches[0].clientX;
        if (!x) {
          return;
        }
        handleMove(e.currentTarget.parentNode as HTMLElement, x);
      }}
      onTouchEnd={(e) => {
        handleFinished();
      }}
      onDragStart={(e) => {
        e.dataTransfer.setDragImage(dragImg, 0, 0);
        e.dataTransfer.setData('type', type);
      }}
      onDrag={(e) => {
        if (!e.currentTarget.parentNode) {
          return;
        }
        if (!(e.currentTarget.parentNode instanceof HTMLElement)) {
          return;
        }
        const x = e.pageX;
        if (!x) {
          return;
        }
        handleMove(e.currentTarget.parentNode as HTMLElement, x);
      }}
      onDragEnd={(e) => {
        handleFinished();
      }}
    >
      <div
        style={{
          width: 5,
          backgroundColor: '#424242',
          borderRadius: 3,
          height: '100%',
          zIndex: Number.MAX_SAFE_INTEGER,
        }}
      />
    </div>
  );
}
