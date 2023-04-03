import Loading from 'components/Loading';
import { useAutoProc, useMXDataCollectionsBy } from 'legacy/hooks/ispyb';
import _ from 'lodash';
import { Suspense } from 'react';
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
} from 'react-bootstrap';
import { DataCollectionGroup } from 'legacy/pages/mx/model';

import { useAutoProcRanking, usePipelines } from 'hooks/mx';
import {
  AutoProcIntegration,
  getRankedResults,
} from 'legacy/helpers/mx/results/resultparser';
import { usePersistentParamState } from 'hooks/useParam';
import LazyWrapper from 'legacy/components/loading/lazywrapper';
import { MetadataRow } from 'components/Events/Metadata';
import MasonryLayout from 'components/Layout/Mansonry';
import { DataCollectionGroupPanel } from '../../dataset/datacollectiongroup/DataCollectionGroupPanel';
import { UnitCellInfo } from '../../dataset/datacollectiongroup/summary/UnitCellInfo';

export function ProteinsInfo({
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
  const proteins = _(dataCollectionGroups || [])
    .map((dcg) => dcg.Protein_acronym)
    .filter((p) => p !== undefined)
    .uniq()
    .sort()
    .value();

  const [proteinFilter, setProteinFilter] = usePersistentParamState<string>(
    'protein',
    'All'
  );

  const target = proteinFilter === 'All' ? proteins[0] : proteinFilter;

  const pipelines = usePipelines();
  const ranking = useAutoProcRanking();

  const programDcIds = _(dataCollectionGroups || [])
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
    dataCollectionId: programDcIds || 'none',
  });

  const rankedIntegrations = getRankedResults(
    integrations?.flatMap((d) => d) || [],
    ranking.rankShell,
    ranking.rankParam,
    pipelines.pipelines,
    true
  );

  if (!proteins.length) {
    return <Alert variant={'info'}>No targets in this session.</Alert>;
  }

  return (
    <Container fluid>
      <Container fluid style={{ marginBottom: '1rem' }}>
        <Row>
          <Col xs={'auto'} style={{ display: 'flex', alignItems: 'center' }}>
            <strong>Select target:</strong>
          </Col>
          {proteins.map((p) => {
            return (
              <Col key={p} xs={'auto'}>
                <Button
                  size="sm"
                  variant={p === target ? 'primary' : 'outline-primary'}
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
      {target && (
        <Suspense fallback={<Loading />}>
          <ProteinInfo
            key={target}
            sessionId={sessionId}
            proposalName={proposalName}
            protein={target}
            dataCollectionGroups={dataCollectionGroups || []}
            rankedIntegrations={rankedIntegrations}
          />
        </Suspense>
      )}
    </Container>
  );
}

export function ProteinInfo({
  sessionId,
  proposalName,
  protein,
  dataCollectionGroups,
  rankedIntegrations,
}: {
  sessionId: string;
  proposalName: string;
  protein: string;
  dataCollectionGroups: DataCollectionGroup[];
  rankedIntegrations: AutoProcIntegration[];
}) {
  const proteinDataCollectionGroups = dataCollectionGroups.filter(
    (dcg) => dcg.Protein_acronym === protein
  );

  const dataCollectionIds = _.uniq(
    proteinDataCollectionGroups.map(
      (dcg) => dcg.DataCollection_dataCollectionId
    )
  ).sort();

  const proteinIntegrations = rankedIntegrations.filter((i) =>
    dataCollectionIds.includes(i.dataCollectionId)
  );

  return (
    <Container fluid>
      <Card style={{ backgroundColor: 'lightgrey', padding: '1rem' }}>
        <Col>
          <Row>
            <Col>
              <h1>{protein}</h1>
            </Col>
          </Row>
          <MetadataRow
            properties={[
              {
                title: 'Data collections',
                content: proteinDataCollectionGroups.length,
              },
              {
                title: 'Collected samples',
                content: _(proteinDataCollectionGroups)
                  .map((dcg) => dcg.BLSample_blSampleId)
                  .uniq()
                  .value().length,
              },
              {
                title: 'Successful pipelines',
                content: proteinIntegrations.length,
              },
            ]}
          ></MetadataRow>
          <Row>
            <Col>
              <StatisticsSection
                sessionId={sessionId}
                proposalName={proposalName}
                dataCollectionGroups={proteinDataCollectionGroups}
                rankedIntegrations={proteinIntegrations}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <BestCollectionSection
                sessionId={sessionId}
                proposalName={proposalName}
                dataCollectionGroups={proteinDataCollectionGroups}
                rankedIntegrations={proteinIntegrations}
              />
            </Col>
          </Row>
        </Col>
      </Card>
    </Container>
  );
}

function BestCollectionSection({
  sessionId,
  proposalName,
  dataCollectionGroups,
  rankedIntegrations,
}: {
  sessionId: string;
  proposalName: string;
  dataCollectionGroups: DataCollectionGroup[];
  rankedIntegrations: AutoProcIntegration[];
}) {
  const proteinBestIntegration = rankedIntegrations[0];

  const proteinBestCollection =
    dataCollectionGroups.find(
      (dcg) =>
        dcg.DataCollection_dataCollectionId ===
        proteinBestIntegration?.dataCollectionId
    ) || dataCollectionGroups[0];

  return (
    <Accordion>
      <Accordion.Item eventKey="bestcollection">
        <Accordion.Header>
          Best data collection for this target during this session
        </Accordion.Header>
        <Accordion.Body style={{ padding: 5 }}>
          <LazyWrapper placeholder={<Loading />}>
            <Container fluid>
              <DataCollectionGroupPanel
                sessionId={sessionId}
                proposalName={proposalName}
                dataCollectionGroup={proteinBestCollection}
              />
            </Container>
          </LazyWrapper>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

function StatisticsSection({
  sessionId,
  proposalName,
  dataCollectionGroups,
  rankedIntegrations,
}: {
  sessionId: string;
  proposalName: string;
  dataCollectionGroups: DataCollectionGroup[];
  rankedIntegrations: AutoProcIntegration[];
}) {
  const spacegroups = _(rankedIntegrations)
    .map((i) => i.spaceGroup.trim())
    .uniq()
    .value();

  const breakpointColumnsObj = {
    default: 6,
    2000: 5,
    1700: 4,
    1400: 3,
    1100: 2,
    900: 1,
  };
  return (
    <Card
      style={{
        backgroundColor: 'white',
        padding: '1rem',
        marginBottom: '1rem',
        marginTop: '1rem',
      }}
    >
      <Col>
        <Row style={{ marginBottom: 10 }}>
          <strong>Statistics</strong>
        </Row>
        <Row>
          <MasonryLayout breakpointCols={breakpointColumnsObj}>
            {_(spacegroups)
              .sortBy(
                (sg) =>
                  rankedIntegrations.filter((i) => i.spaceGroup === sg).length
              )
              .reverse()
              .map((sg) => {
                const sgIntegrations = rankedIntegrations.filter(
                  (i) => i.spaceGroup.trim() === sg
                );
                const collections = _.uniq(
                  sgIntegrations.map((i) => i.dataCollectionId)
                )
                  .map((dcId) =>
                    dataCollectionGroups.find(
                      (dcg) => dcg.DataCollection_dataCollectionId === dcId
                    )
                  )
                  .filter((dcg) => dcg !== undefined);
                const samples = _.uniq(collections.map((c) => c?.BLSample_name))
                  .filter((s) => s !== undefined)
                  .sort();

                const hasBestCollection = sgIntegrations.includes(
                  rankedIntegrations[0]
                );
                const minA = _.minBy(sgIntegrations, (i) => i.cell_a)?.cell_a;
                const maxA = _.maxBy(sgIntegrations, (i) => i.cell_a)?.cell_a;
                const minB = _.minBy(sgIntegrations, (i) => i.cell_b)?.cell_b;
                const maxB = _.maxBy(sgIntegrations, (i) => i.cell_b)?.cell_b;
                const minC = _.minBy(sgIntegrations, (i) => i.cell_c)?.cell_c;
                const maxC = _.maxBy(sgIntegrations, (i) => i.cell_c)?.cell_c;
                const minAlpha = _.minBy(
                  sgIntegrations,
                  (i) => i.cell_alpha
                )?.cell_alpha;
                const maxAlpha = _.maxBy(
                  sgIntegrations,
                  (i) => i.cell_alpha
                )?.cell_alpha;
                const minBeta = _.minBy(
                  sgIntegrations,
                  (i) => i.cell_beta
                )?.cell_beta;
                const maxBeta = _.maxBy(
                  sgIntegrations,
                  (i) => i.cell_beta
                )?.cell_beta;
                const minGamma = _.minBy(
                  sgIntegrations,
                  (i) => i.cell_gamma
                )?.cell_gamma;
                const maxGamma = _.maxBy(
                  sgIntegrations,
                  (i) => i.cell_gamma
                )?.cell_gamma;

                return (
                  <Card key={sg} style={{ margin: 5 }}>
                    <Card.Header className="text-center">
                      <h5 style={{ whiteSpace: 'nowrap' }}>
                        {sg}
                        {hasBestCollection && (
                          <>
                            <br />
                            <Badge bg={'success'}>{'Best collection'}</Badge>
                          </>
                        )}
                      </h5>

                      <i style={{ whiteSpace: 'nowrap' }}>
                        {sgIntegrations.length} pipelines -{' '}
                        {(
                          (sgIntegrations.length / rankedIntegrations.length) *
                          100
                        ).toFixed(0)}
                        %
                      </i>
                      {samples.length > 0 && (
                        <>
                          <br />
                          <i style={{ whiteSpace: 'nowrap' }}>
                            {samples.length} sample
                            {samples.length > 1 ? 's' : ''}
                          </i>
                        </>
                      )}
                    </Card.Header>
                    <UnitCellInfo
                      cell_a={`${minA?.toFixed(1)} - ${maxA?.toFixed(1)}`}
                      cell_b={`${minB?.toFixed(1)} - ${maxB?.toFixed(1)}`}
                      cell_c={`${minC?.toFixed(1)} - ${maxC?.toFixed(1)}`}
                      cell_alpha={`${minAlpha?.toFixed(
                        1
                      )} - ${maxAlpha?.toFixed(1)}`}
                      cell_beta={`${minBeta?.toFixed(1)} - ${maxBeta?.toFixed(
                        1
                      )}`}
                      cell_gamma={`${minGamma?.toFixed(
                        1
                      )} - ${maxGamma?.toFixed(1)}`}
                      spaceGroup={sg}
                    />
                  </Card>
                );
              })
              .value()}
          </MasonryLayout>
        </Row>
      </Col>
    </Card>
  );
}
