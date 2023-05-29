import { useAuth } from 'hooks/useAuth';
import { parsePhasingSteps } from 'legacy/helpers/mx/results/phasingparser';
import { usePhasingList } from 'legacy/hooks/ispyb';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import { PhasingList } from './phasingList';
import { Container } from 'react-bootstrap';

export interface Props {
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
}

export default function PhasingTab({
  proposalName,
  dataCollectionGroup,
}: Props) {
  const { site, token } = useAuth();

  const { data } = usePhasingList({
    proposalName,
    dataCollectionGroupId:
      dataCollectionGroup.DataCollectionGroup_dataCollectionGroupId?.toString() ||
      '-1',
  });
  if (!data || !data.length) return null;

  const results = data.flatMap((r) => r);
  const urlPrefix = `${site.host}${site.apiPrefix}/${token}`;
  const parsedResults = parsePhasingSteps(results, proposalName, urlPrefix);

  return (
    <Container fluid>
      <PhasingList results={parsedResults} proposalName={proposalName} />
    </Container>
  );
}
