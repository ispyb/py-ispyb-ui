import Loading from 'components/Loading';
import { useMXDataCollectionsBy } from 'legacy/hooks/ispyb';
import _ from 'lodash';
import { Suspense } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { DataCollectionGroup } from '../model';

import DataCollectionGroupPanel from '../datacollectiongroup/datacollectiongrouppanel';

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
}: {
  sessionId: string;
  proposalName: string;
  protein: string;
  dataCollectionGroups: DataCollectionGroup[];
}) {
  const proteinDataCollectionGroups = dataCollectionGroups.filter(
    (dcg) => dcg.Protein_acronym === protein
  );

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
              dataCollectionGroup={proteinDataCollectionGroups[0]}
              defaultCompact={false}
              selectedPipelines={[]}
              resultRankShell={'Inner'}
              resultRankParam={'<I/Sigma>'}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
