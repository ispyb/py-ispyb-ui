import React from 'react';
import { useParams } from 'react-router-dom';
import MXPage from 'pages/mx/mxpage';
import { Card } from 'react-bootstrap';
import { useMXDataCollectionsBy } from 'hooks/ispyb';
import DataCollectionGroupPanel from 'pages/mx/datacollectiongroup/datacollectiongrouppanel';
import { DataCollectionGroup } from 'pages/mx/model';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function MXDataCollectionGroupPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();
  const { data: dataCollectionGroups, isError } = useMXDataCollectionsBy({ proposalName, sessionId });
  if (isError) throw Error(isError);
  debugger;
  return (
    <MXPage sessionId={sessionId} proposalName={proposalName}>
      <Card>
        {dataCollectionGroups.map((dataCollectionGroup: DataCollectionGroup) => (
          <div style={{ margin: 5 }}>
            <DataCollectionGroupPanel dataCollectionGroup={dataCollectionGroup} proposalName={proposalName} sessionId={sessionId}></DataCollectionGroupPanel>
          </div>
        ))}
      </Card>
    </MXPage>
  );
}
