import React from 'react';
import { useParams } from 'react-router-dom';
import { useSession, useDataCollection } from 'hooks/ispyb';
import GridSquarePanel from 'pages/em/gridsquarepanel';
import { useDataCollectionToGridSquares } from 'pages/em/helper';

export default function EMSessionPage() {
  const { sessionId } = useParams();
  const { data, sessionError } = useSession({ sessionId });
  if (sessionError) throw Error(sessionError);

  if (data.length > 0) {
    const proposalName = `${data[0].Proposal_proposalCode}${data[0].Proposal_proposalNumber}`;
    const dataCollectionResponse = useDataCollection({ proposalName, sessionId });
    const sampleList = useDataCollectionToGridSquares(dataCollectionResponse.data, proposalName);
    if (dataCollectionResponse.error) throw Error(dataCollectionResponse.error);

    return (
      <>
        {sampleList.map((sample) => (
          <GridSquarePanel sampleList={sample} />
        ))}
      </>
    );
  }

  return <div>No data available</div>;
}
