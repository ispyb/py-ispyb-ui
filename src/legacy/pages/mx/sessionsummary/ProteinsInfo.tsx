import Loading from 'components/Loading';
import { useAutoProc, useMXDataCollectionsBy } from 'legacy/hooks/ispyb';
import _ from 'lodash';
import { Suspense } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { DataCollectionGroup } from '../model';

import DataCollectionGroupPanel from '../datacollectiongroup/datacollectiongrouppanel';
import { useAutoProcRanking, usePipelines } from 'hooks/mx';
import {
  AutoProcIntegration,
  getRankedResults,
} from 'legacy/helpers/mx/results/resultparser';

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
  return (
    <Container fluid>
      <Col>
        {_(proteins)
          .sort()
          .value()
          .map(
            (protein) =>
              protein && (
                <Suspense key={protein} fallback={<Loading />}>
                  <ProteinInfo
                    key={protein}
                    sessionId={sessionId}
                    proposalName={proposalName}
                    protein={protein}
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
  const ranking = useAutoProcRanking();

  const proteinDataCollectionGroups = dataCollectionGroups.filter(
    (dcg) => dcg.Protein_acronym === protein
  );

  const dataCollectionIds = _.uniq(
    proteinDataCollectionGroups.map(
      (dcg) => dcg.DataCollection_dataCollectionId
    )
  ).sort();

  const proteinBestIntegration = rankedIntegrations.find((i) =>
    dataCollectionIds.includes(i.dataCollectionId)
  );

  const proteinBestCollection =
    proteinDataCollectionGroups.find(
      (dcg) =>
        dcg.DataCollection_dataCollectionId ===
        proteinBestIntegration?.dataCollectionId
    ) || proteinDataCollectionGroups[0];

  return (
    <Container fluid>
      <Row>
        <Col>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '1rem',
              backgroundColor: 'lightgrey',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <h1>
              <strong>{protein} </strong> - {proteinDataCollectionGroups.length}{' '}
              collections
              <br></br>
              <small style={{ fontSize: 20 }}>
                <i>Best collection</i>
              </small>
            </h1>
            <DataCollectionGroupPanel
              sessionId={sessionId}
              proposalName={proposalName}
              dataCollectionGroup={proteinBestCollection}
              defaultCompact={false}
              selectedPipelines={[]}
              resultRankShell={ranking.rankShell}
              resultRankParam={ranking.rankParam}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
