import { useMXFluorescenceSpectras } from 'legacy/hooks/ispyb';
import { useParams } from 'react-router';
import { FluorescenceGraph } from './FluorescenceGraph';

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
    <>
      <FluorescenceGraph proposalName={proposalName} spectra={spectra} />
    </>
  );
}
