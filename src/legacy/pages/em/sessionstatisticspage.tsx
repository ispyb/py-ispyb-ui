import { useParams } from 'react-router-dom';
import EMPage from 'legacy/pages/em/empage';
import { useEMDataCollectionsBy, useEMStatistics } from 'legacy/hooks/ispyb';
import {
  useDataCollectionToGridSquares,
  useGridSquareStatisticsToPlot,
} from 'legacy/pages/em/helper';
import EmStatisticsPanel from 'legacy/pages/em/emstatisticspanel';
import { usePersistentParamState } from 'hooks/useParam';
import { useMemo } from 'react';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function SessionStatisticsPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();

  const { data, isError } = useEMStatistics({ sessionId, proposalName });
  if (isError) throw Error(isError);

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

  const filteredStatistics = useMemo(
    () =>
      (data || []).filter(
        (stat) =>
          grid === 'all' ||
          filteredSampleList.some((sample) =>
            sample.grids.some(
              (g) => g.dataCollectionId === stat.dataCollectionId
            )
          )
      ),
    [data, grid, filteredSampleList]
  );

  const statisticsPlotData = useGridSquareStatisticsToPlot(filteredStatistics);

  return (
    <EMPage sessionId={sessionId} proposalName={proposalName}>
      <EmStatisticsPanel
        statisticsPlotData={statisticsPlotData}
        proposalName={proposalName}
      ></EmStatisticsPanel>
    </EMPage>
  );
}
