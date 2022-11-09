import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LazyWrapper from 'components/loading/lazywrapper';
import LoadingPanel from 'components/loading/loadingpanel';
import { formatDateToDayAndTime, parseDate } from 'helpers/dateparser';
import { useEventsSession, useSession } from 'hooks/pyispyb';
import { SessionResponse } from 'pages/model';
import Page from 'pages/page';
import { Suspense, useEffect, useState } from 'react';
import { Alert, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import SSXDataCollectionGroupPane from './ssxdatacollectiongrouppane';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function SSXDataCollectionGroupsPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();

  const { data: dcgs, isError: dcsError } = useEventsSession({ sessionId: Number(sessionId), proposal: proposalName });
  if (dcsError) throw Error(dcsError);

  const { data: session, isError: sessionError } = useSession(sessionId);
  if (sessionError) throw Error(sessionError);

  let content;

  const filtereddcgs = dcgs && dcgs.results ? dcgs.results.sort((a, b) => parseDate(b.startTime).getTime() - parseDate(a.startTime).getTime()).filter((a) => a.count) : undefined;

  const [deployedId, setDeployedId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!deployedId && filtereddcgs && filtereddcgs.length) {
      setDeployedId(filtereddcgs[0].id);
    }
  }, [filtereddcgs]);

  if (filtereddcgs && filtereddcgs.length && session) {
    content = (
      <Card>
        {filtereddcgs.map((dcg) => (
          <LazyWrapper key={dcg.id} placeholder={<LoadingPanel></LoadingPanel>}>
            <Suspense fallback={<LoadingPanel></LoadingPanel>}>
              <SSXDataCollectionGroupPane
                dcg={dcg}
                session={session}
                proposalName={proposalName}
                deployed={dcg.id == deployedId}
                onDeploy={() => {
                  setDeployedId(dcg.id);
                }}
              ></SSXDataCollectionGroupPane>
            </Suspense>
          </LazyWrapper>
        ))}
      </Card>
    );
  } else {
    content = (
      <Alert variant="info">
        <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 10 }} />
        No data found.
      </Alert>
    );
  }

  return (
    <Page selected="sessions">
      <SSXSessionInfo session={session} proposalName={proposalName}></SSXSessionInfo>
      {content}
    </Page>
  );
}

export function SSXSessionInfo({ session, proposalName }: { session?: SessionResponse; proposalName: string }) {
  if (session) {
    return (
      <Alert variant="secondary">
        <h5>
          {proposalName} on {session.beamLineName} - Session from {formatDateToDayAndTime(session.startDate)} to {formatDateToDayAndTime(session.endDate)}
        </h5>
      </Alert>
    );
  }
  return (
    <Alert variant="warning">
      <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 10 }} />
      No session information found.
    </Alert>
  );
}
