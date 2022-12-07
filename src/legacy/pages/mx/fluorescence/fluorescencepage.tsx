import React from 'react';
import { useParams } from 'react-router-dom';
import MXPage from 'legacy/pages/mx/mxpage';
import { Alert, Card } from 'react-bootstrap';
import { useMXFluorescenceSpectras } from 'legacy/hooks/ispyb';

import LazyWrapper from 'legacy/components/loading/lazywrapper';
import LoadingPanel from 'legacy/components/loading/loadingpanel';

import FluorescencePanel from './fluorescencepanel';
import moment from 'moment';

type Param = {
  sessionId: string;
  proposalName: string;
};

export default function MXFluorescencePage() {
  const { sessionId = '', proposalName = '' } = useParams<Param>();
  const { data: spectras, isError } = useMXFluorescenceSpectras({
    proposalName,
    sessionId,
  });
  spectras?.sort((a, b) => {
    return (
      moment(b.startTime, 'MMMM Do YYYY, h:mm:ss A').toDate().getTime() -
      moment(a.startTime, 'MMMM Do YYYY, h:mm:ss A').toDate().getTime()
    );
  });
  if (isError) throw Error(isError);
  if (spectras && spectras.length) {
    return (
      <MXPage sessionId={sessionId} proposalName={proposalName}>
        <Card>
          {spectras.map((spectra) => (
            <div style={{ margin: 5 }}>
              <LazyWrapper placeholder={<LoadingPanel></LoadingPanel>}>
                <FluorescencePanel
                  sessionId={sessionId}
                  proposalName={proposalName}
                  spectra={spectra}
                ></FluorescencePanel>
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
          No Fluorescence spectras found!
        </Alert>
      </Card>
    </MXPage>
  );
}
