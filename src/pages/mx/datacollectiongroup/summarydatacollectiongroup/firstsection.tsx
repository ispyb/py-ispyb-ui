import React from 'react';
import { DataCollectionGroup } from 'pages/mx/model';
import SimpleParameterTable from 'components/table/simpleparametertable';

export default function FirstSection({ dataCollectionGroup }: { dataCollectionGroup: DataCollectionGroup }) {
  const {
    Workflow_workflowType,
    Protein_acronym,
    BLSample_name,
    DataCollection_imagePrefix,
    DataCollection_numberOfImages,
    totalNumberOfImages,
    transmission,
    DataCollection_numberOfPasses,
  } = dataCollectionGroup;

  return (
    <SimpleParameterTable
      parameters={[
        { key: 'Workflow', value: Workflow_workflowType },
        { key: 'Protein', value: Protein_acronym },
        { key: 'Sample', value: BLSample_name },
        { key: 'Prefix', value: DataCollection_imagePrefix },
        { key: 'Run', value: DataCollection_numberOfPasses },
        { key: '# Images (Total)', value: `${DataCollection_numberOfImages} (${totalNumberOfImages})` },
        { key: 'Transmission', value: transmission, units: '%' },
      ]}
    ></SimpleParameterTable>
  );
}
