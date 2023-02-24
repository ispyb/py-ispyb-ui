import { Dataset } from 'legacy/hooks/icatmodel';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import MXDataCollectionGroupParameters from './parameters';

export interface Props {
  dataCollectionGroup: Dataset;
}

export default function BeamlineDataCollectionGroupPanel({
  dataCollectionGroup,
}: Props) {
  return (
    <MXDataCollectionGroupParameters
      dataCollectionGroup={dataCollectionGroup}
    />
  );
}
