import { useMXFluorescenceSpectras } from 'legacy/hooks/ispyb';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router';
import MXPage from '../mxpage';
import FluorescenceGraph from './fluorescencegraph';

type Param = {
  sessionId: string;
  proposalName: string;
  xrfId: string;
};

export default function MxFluorescenceViewer() {
  const { sessionId = '', proposalName = '', xrfId = '' } = useParams<Param>();
  const { data: spectras, isError } = useMXFluorescenceSpectras({
    proposalName,
    sessionId,
  });

  if (isError) throw Error(isError);
  if (!spectras || !spectras.length) {
    return <></>;
  }

  const spectra = spectras.filter(
    (s) => s.xfeFluorescenceSpectrumId === Number(xrfId)
  )[0];

  if (!spectra) {
    return <></>;
  }

  return (
    <MXPage proposalName={proposalName} sessionId={sessionId}>
      <Card style={{ padding: 20 }}>
        <FluorescenceGraph
          proposalName={proposalName}
          spectra={spectra}
        ></FluorescenceGraph>
      </Card>
    </MXPage>
  );
}
