import Loading from 'components/Loading';
import { useMXDataCollectionsBy, useSession } from 'legacy/hooks/ispyb';
import _ from 'lodash';
import { Suspense } from 'react';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import MXPage from '../mxpage';
import { SessionInfo } from './SessionInfo';
import { ShippingsInfo } from './ShippingsInfo';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function MXSessionSummaryPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();

  return (
    <MXPage sessionId={sessionId} proposalName={proposalName}>
      <Card>
        <Suspense fallback={<Loading />}>
          <SessionInfo sessionId={sessionId} proposalName={proposalName} />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <ShippingsInfo sessionId={sessionId} proposalName={proposalName} />
        </Suspense>
      </Card>
    </MXPage>
  );
}
