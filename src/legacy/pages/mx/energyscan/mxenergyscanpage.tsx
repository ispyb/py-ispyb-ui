import React from 'react';
import { useParams } from 'react-router-dom';
import MXPage from 'legacy/pages/mx/mxpage';
import { Alert, Card } from 'react-bootstrap';
import { useMXEnergyScans } from 'legacy/hooks/ispyb';

import LazyWrapper from 'legacy/components/loading/lazywrapper';
import LoadingPanel from 'legacy/components/loading/loadingpanel';

import EnergyScanPanel from './energyscanpanel';
import moment from 'moment';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function MXEnergyScanPage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();
  const { data: energyScans, isError } = useMXEnergyScans({
    proposalName,
    sessionId,
  });
  energyScans?.sort((a, b) => {
    return (
      moment(b.startTime, 'MMMM Do YYYY, h:mm:ss A').toDate().getTime() -
      moment(a.startTime, 'MMMM Do YYYY, h:mm:ss A').toDate().getTime()
    );
  });
  if (isError) throw Error(isError);
  if (energyScans && energyScans.length) {
    return (
      <MXPage sessionId={sessionId} proposalName={proposalName}>
        <Card>
          {energyScans.map((energyScan) => (
            <div style={{ margin: 5 }}>
              <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                <EnergyScanPanel
                  sessionId={sessionId}
                  proposalName={proposalName}
                  energyScan={energyScan}
                ></EnergyScanPanel>
              </LazyWrapper>
            </div>
          ))}
        </Card>
      </MXPage>
    );
  }
  return (
    <MXPage sessionId={sessionId} proposalName={proposalName}>
      <Card>
        <Alert variant="info" style={{ margin: 20 }}>
          No Energy scan found!
        </Alert>
      </Card>
    </MXPage>
  );
}
