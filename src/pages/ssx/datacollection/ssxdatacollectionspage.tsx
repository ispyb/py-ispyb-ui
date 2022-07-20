import { faArrowAltCircleRight, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { H5 } from '@storybook/components';
import LazyWrapper from 'components/loading/lazywrapper';
import LoadingPanel from 'components/loading/loadingpanel';
import { formatDateTo, formatDateToDayAndTime } from 'helpers/dateparser';
import { useSession, useSSXDataCollections } from 'hooks/pyispyb';
import moment from 'moment';
import { SessionResponse } from 'pages/model';
import Page from 'pages/page';
import { Alert, Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import SSXDataCollectionPane from './ssxdatacollectionpane';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function SSXDataCollectionsPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();

  const { data: dcs, isError: dcsError } = useSSXDataCollections(sessionId);
  if (dcsError) throw Error(dcsError);

  const { data: session, isError: sessionError } = useSession(sessionId);
  if (sessionError) throw Error(sessionError);

  let content;

  if (dcs && dcs.length) {
    content = (
      <Card>
        {dcs.map((dc) => (
          <SSXDataCollectionPane dc={dc} session={session}></SSXDataCollectionPane>
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
