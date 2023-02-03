import { usePhasingList } from 'legacy/hooks/ispyb';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import { MRTable } from './mrTable';

export interface Props {
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
}

export default function MRTab({ proposalName, dataCollectionGroup }: Props) {
  const { data } = usePhasingList({
    proposalName,
    dataCollectionGroupId:
      dataCollectionGroup.DataCollectionGroup_dataCollectionGroupId?.toString() ||
      '-1',
  });
  if (!data || !data.length) return null;

  const results = data.flatMap((r) => r);

  return <MRTable results={results} proposalName={proposalName} />;
}
