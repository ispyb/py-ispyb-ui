import { usePhasingList } from 'legacy/hooks/ispyb';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import { PhasingList } from './phasingList';

export interface Props {
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
}

export default function PhasingTab({
  proposalName,
  dataCollectionGroup,
}: Props) {
  const { data } = usePhasingList({
    proposalName,
    dataCollectionGroupId:
      dataCollectionGroup.DataCollectionGroup_dataCollectionGroupId?.toString() ||
      '-1',
  });
  if (!data || !data.length) return null;

  const results = data.flatMap((r) => r);

  return <PhasingList results={results} proposalName={proposalName} />;
}
