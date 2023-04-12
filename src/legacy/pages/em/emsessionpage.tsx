import { useParams } from 'react-router-dom';
import EMPage from 'legacy/pages/em/empage';
import { useEMDataCollectionsBy } from 'legacy/hooks/ispyb';
import GridSquarePanel from 'legacy/pages/em/grid/gridsquarepanel';
import { useDataCollectionToGridSquares } from 'legacy/pages/em/helper';
import { usePersistentParamState } from 'hooks/useParam';
import { useMemo } from 'react';

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
    dataCollectionResponse.data || [],
    proposalName
  );

  const [grid] = usePersistentParamState<string>('grid', 'all');

  const filteredSampleList = useMemo(
    () =>
      sampleList.filter(
        (sample) => grid === 'all' || sample.sampleName === grid
      ),
    [sampleList, grid]
  );

  return (
    <EMPage sessionId={sessionId} proposalName={proposalName}>
      <div style={{ margin: 10 }}>
        {filteredSampleList.map((sample, i) => (
          <GridSquarePanel key={i} sampleList={sample} sessionId={sessionId} />
        ))}
      </div>
    </EMPage>
  );
}
