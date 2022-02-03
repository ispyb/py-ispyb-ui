import React from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { useSession, useDataCollection, useEMStatistics } from 'hooks/ispyb';
import GridSquarePanel from 'pages/em/gridsquarepanel';
import { useGridSquareStatisticsToPlot, useDataCollectionToGridSquares } from 'pages/em/helper';
import ErrorUserMessage from 'components/usermessages/errorusermessage';
import EmStatisticsPanel from 'pages/em/emstatisticspanel';

type Param = {
  sessionId?: string;
};

export default function EMSessionPage() {
  const { sessionId } = useParams<Param>();
  const { data, isError: sessionError } = useSession({ sessionId });
  if (sessionError) throw Error(sessionError);

  if (data.length > 0) {
    const proposalName = `${data[0].Proposal_proposalCode}${data[0].Proposal_proposalNumber}`;
    const dataCollectionResponse = useDataCollection({ proposalName, sessionId });
    const statsResponse = useEMStatistics({ proposalName, sessionId });
    const statisticsPlotData = useGridSquareStatisticsToPlot(statsResponse.data);

    if (dataCollectionResponse.isError) throw Error(dataCollectionResponse.isError);
    if (statsResponse.isError) throw Error(statsResponse.isError);

    const sampleList = useDataCollectionToGridSquares(dataCollectionResponse.data, proposalName);

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
          <Tab eventKey="statistics" title="Statistics">
            <EmStatisticsPanel statisticsPlotData={statisticsPlotData}></EmStatisticsPanel>
          </Tab>
        </Tabs>
      </Card>
    );
  }

  return <ErrorUserMessage title="No data was retrieved" />;
}
