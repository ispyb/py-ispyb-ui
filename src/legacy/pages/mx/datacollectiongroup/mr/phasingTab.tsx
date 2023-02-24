import { useAuth } from 'hooks/useAuth';
import { parsePhasingSteps } from 'legacy/helpers/mx/results/phasingparser';
import { useSubDatasets } from 'legacy/hooks/icat';
import { Dataset, getNotes } from 'legacy/hooks/icatmodel';
import { usePhasingList } from 'legacy/hooks/ispyb';
import { DataCollectionGroup, PhasingInfo } from 'legacy/pages/mx/model';
import { PhasingList } from './phasingList';

export interface Props {
  proposalName: string;
  dataCollectionGroup: Dataset;
}

export default function PhasingTab({
  proposalName,
  dataCollectionGroup,
}: Props) {
  const { site, token } = useAuth();
  const { data: phasings } = useSubDatasets({
    dataset: dataCollectionGroup,
    type: 'phasing',
  });

  if (!phasings || !phasings.length) return null;

  const urlPrefix = `${site.host}${site.apiPrefix}/resource/${token}`;
  const parsedResults = parsePhasingSteps(phasings, proposalName, urlPrefix);

  return <PhasingList results={parsedResults} proposalName={proposalName} />;
}
