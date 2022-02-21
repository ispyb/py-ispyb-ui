import React from 'react';
import { useParams } from 'react-router-dom';
import MXPage from 'pages/mx/mxpage';
import { Card } from 'react-bootstrap';
import { useMXDataCollectionsBy } from 'hooks/ispyb';
import DataCollectionGroupPanel from 'pages/mx/datacollectiongroup/datacollectiongrouppanel';
import { DataCollectionGroup } from 'pages/mx/model';
import LazyWrapper from 'components/loading/lazywrapper';
import LoadingPanel from 'components/loading/loadingpanel';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function MXDataCollectionGroupPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();
  const { data: dataCollectionGroups, isError } = useMXDataCollectionsBy({ proposalName, sessionId });
  if (isError) throw Error(isError);
  return (
    <MXPage sessionId={sessionId} proposalName={proposalName}>
      <Card>
        {dataCollectionGroups.map((dataCollectionGroup: DataCollectionGroup) => (
          <div style={{ margin: 5 }}>
            <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
              <DataCollectionGroupPanel dataCollectionGroup={dataCollectionGroup} proposalName={proposalName} sessionId={sessionId}></DataCollectionGroupPanel>
            </LazyWrapper>
          </div>
        ))}
      </Card>
    </MXPage>
  );
}
