import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab, Card } from 'react-bootstrap';
//import { useSession, useDataCollection, useEMStatistics } from 'hooks/ispyb';
import { useSession, useDataCollection } from 'hooks/ispyb';
import GridSquarePanel from 'pages/em/grid/gridsquarepanel';
import { getEMStatisticsBy } from 'api/ispyb';
//import { useGridSquareStatisticsToPlot, useDataCollectionToGridSquares } from 'pages/em/helper';
import { useDataCollectionToGridSquares } from 'pages/em/helper';

import ErrorUserMessage from 'components/usermessages/errorusermessage';
//import EmStatisticsPanel from 'pages/em/emstatisticspanel';
//import { StatisticsPlotData } from 'pages/em/model';

type Param = {
  sessionId?: string;
};

export default function EMSessionPage() {
  /*
  const [statisticsPlotData, setstatisticsPlotData] = useState<StatisticsPlotData>({
    movieNumber: [],
    averageData: [],
    defocusU: [],
    defocusV: [],
    resolution: [],
    resolutionDistribution: [],
    defocusUDistribution: [],
    defocusVDistribution: [],
    angleDistribution: [],
    angle: [],
    defocusDifference: [],
  });
  */

  const { sessionId } = useParams<Param>();
  const { data, isError: sessionError } = useSession({ sessionId });
  if (sessionError) throw Error(sessionError);

  if (data.length > 0) {
    const { Proposal_proposalCode, Proposal_proposalNumber } = data[0];
    const proposalName = `${Proposal_proposalCode}${Proposal_proposalNumber}`;
    const dataCollectionResponse = useDataCollection({ proposalName, sessionId });
    const sampleList = useDataCollectionToGridSquares(dataCollectionResponse.data, proposalName);

    useEffect(() => {
      fetch(getEMStatisticsBy({ proposalName, sessionId }).url).then((response) => response.json());
      //.then((data) => setstatisticsPlotData(useGridSquareStatisticsToPlot(data)));
    });

    return (
      <Card>
        <Tabs style={{ margin: 10 }} defaultActiveKey="summary" id="emsessionpage-tabs" className="mb-3">
          <Tab style={{ margin: 30 }} eventKey="summary" title="Summary">
            <>
              {sampleList.map((sample) => (
                <GridSquarePanel sampleList={sample} />
              ))}
            </>
          </Tab>
          <Tab eventKey="statistics" title="Statistics"></Tab>
        </Tabs>
      </Card>
    );
  }
  //<EmStatisticsPanel statisticsPlotData={statisticsPlotData}></EmStatisticsPanel>
  return <ErrorUserMessage title="No data was retrieved" />;
}
