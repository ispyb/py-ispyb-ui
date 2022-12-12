import React from 'react';
import { useParams } from 'react-router-dom';
import EMPage from 'legacy/pages/em/empage';
import { Card } from 'react-bootstrap';
import { useEMDataCollectionsBy } from 'legacy/hooks/ispyb';
import GridSquarePanel from 'legacy/pages/em/grid/gridsquarepanel';
import { useDataCollectionToGridSquares } from 'legacy/pages/em/helper';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function EMSessionPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();
  const dataCollectionResponse = useEMDataCollectionsBy({
    proposalName,
    sessionId,
  });
  const sampleList = useDataCollectionToGridSquares(
    dataCollectionResponse.data,
    proposalName
  );

  return (
    <EMPage sessionId={sessionId} proposalName={proposalName}>
      <Card>
        <div style={{ margin: 10 }}>
          {sampleList.map((sample) => (
            <GridSquarePanel sampleList={sample} sessionId={sessionId} />
          ))}
        </div>
      </Card>
    </EMPage>
  );
}
