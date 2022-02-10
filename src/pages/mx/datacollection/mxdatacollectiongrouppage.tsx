import React from 'react';
import { useParams } from 'react-router-dom';
import MXPage from 'pages/mx/mxpage';
import { Card } from 'react-bootstrap';
import { useMXDataCollectionsBy } from 'hooks/ispyb';
import DataCollectionGroupPanel from 'pages/mx/datacollection/datacollectiongrouppanel';
import { DataCollection } from 'pages/mx/model';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function MXDataCollectionGroupPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();
  const { data: dataCollections, isError } = useMXDataCollectionsBy({ proposalName, sessionId });
  if (isError) throw Error(isError);
  return (
    <MXPage sessionId={sessionId} proposalName={proposalName}>
      <Card>
        {dataCollections.map((dataCollection: DataCollection) => (
          <div style={{ margin: 5 }}>
            <DataCollectionGroupPanel dataCollection={dataCollection} proposalName={proposalName} sessionId={sessionId}></DataCollectionGroupPanel>
          </div>
        ))}
      </Card>
    </MXPage>
  );
}
