import React from 'react';
import { useParams } from 'react-router-dom';
import { useSession, useDataCollection } from 'hooks/ispyb';
import GridSquarePanel from 'pages/em/gridsquarepanel';
import { useDataCollectionToGridSquares } from 'pages/em/helper';
import ErrorUserMessage from 'components/usermessages/errorusermessage';

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
    const sampleList = useDataCollectionToGridSquares(dataCollectionResponse.data, proposalName);
    if (dataCollectionResponse.isError) throw Error(dataCollectionResponse.isError);

    return (
      <>
        {sampleList.map((sample) => (
          <GridSquarePanel sampleList={sample} />
        ))}
      </>
    );
  }

  return <ErrorUserMessage title="No data was retrieved" />;
}
