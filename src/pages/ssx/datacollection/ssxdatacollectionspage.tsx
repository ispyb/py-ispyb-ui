import { faArrowRight, faBackward, faInfoCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LazyWrapper from 'components/loading/lazywrapper';
import LoadingPanel from 'components/loading/loadingpanel';
import { formatDateToDayAndTime } from 'helpers/dateparser';
import { useSession, useSSXDataCollectionGroup, useSSXDataCollections } from 'hooks/pyispyb';
import { SessionResponse } from 'pages/model';
import Page from 'pages/page';
import { Suspense } from 'react';
import { Alert, Button, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import SSXDataCollectionGroupPane from '../datacollectiongroup/ssxdatacollectiongrouppane';
import { DataCollectionGroupResponse } from '../model';
import SSXDataCollectionPane from './ssxdatacollectionpane';

type Param = {
  sessionId: string;
  dataCollectionGroupId: string;
  proposalName: string;
};

export default function SSXDataCollectionsPage() {
  const { sessionId = '', proposalName = '', dataCollectionGroupId = '' } = useParams<Param>();

  const { data: dcs, isError: dcsError } = useSSXDataCollections(sessionId, dataCollectionGroupId);
  if (dcsError) throw Error(dcsError);

  const { data: session, isError: sessionError } = useSession(sessionId);
  if (sessionError) throw Error(sessionError);

  const { data: dcg, isError: dcgError } = useSSXDataCollectionGroup(dataCollectionGroupId);
  if (dcgError) throw Error(dcgError);

  let content;

  if (dcs && dcs.length) {
    content = (
      <>
        {dcs.map((dc) => (
          <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
            <Suspense fallback={<LoadingPanel></LoadingPanel>}>
              <SSXDataCollectionPane dc={dc} session={session}></SSXDataCollectionPane>
            </Suspense>
          </LazyWrapper>
        ))}
      </>
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
      <SSXSessionInfo session={session} dcg={dcg} proposalName={proposalName}></SSXSessionInfo>
      <Card>
        {session && (
          <Alert variant="info" style={{ margin: 10 }}>
            <h5 style={{ marginBottom: 15 }}>{<FontAwesomeIcon style={{ marginRight: 10 }} icon={faPlusCircle}></FontAwesomeIcon>}Details for experiment: </h5>
            {session && dcg && <SSXDataCollectionGroupPane dcg={dcg} proposalName={proposalName} session={session}></SSXDataCollectionGroupPane>}
            <a style={{ margin: 10 }} href={`/${proposalName}/SSX/${session.sessionId}`}>
              <h5>{<FontAwesomeIcon style={{ marginRight: 10 }} icon={faBackward}></FontAwesomeIcon>}Back to experiments</h5>
            </a>
          </Alert>
        )}
        {content}
      </Card>
    </Page>
  );
}

export function SSXSessionInfo({ session, proposalName, dcg }: { session?: SessionResponse; proposalName: string; dcg?: DataCollectionGroupResponse }) {
  if (session && dcg) {
    return (
      <Alert variant="secondary">
        <h5>
          {proposalName} on {session.beamLineName} - Session from {formatDateToDayAndTime(session.startDate)} to {formatDateToDayAndTime(session.endDate)}
        </h5>
        {/* <h5>
          {<FontAwesomeIcon style={{ marginRight: 10 }} icon={faArrowRight}></FontAwesomeIcon>}
          Experiment from {formatDateToDayAndTime(dcg.startTime)} to {formatDateToDayAndTime(dcg.endTime)}
        </h5> */}
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
