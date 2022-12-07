import React from 'react';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';

export default function FirstSection({
  dataCollectionGroup,
  compact = false,
}: {
  dataCollectionGroup: DataCollectionGroup;
  compact?: boolean;
}) {
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
  const parameters = compact
    ? [
        { key: 'Protein', value: Protein_acronym },
        { key: 'Prefix', value: DataCollection_imagePrefix },
        {
          key: '# Images (Total)',
          value: `${DataCollection_numberOfImages} (${totalNumberOfImages})`,
        },
      ]
    : [
        { key: 'Workflow', value: Workflow_workflowType },
        { key: 'Protein', value: Protein_acronym },
        { key: 'Sample', value: BLSample_name },
        { key: 'Prefix', value: DataCollection_imagePrefix },
        { key: 'Run', value: DataCollection_numberOfPasses },
        {
          key: '# Images (Total)',
          value: `${DataCollection_numberOfImages} (${totalNumberOfImages})`,
        },
        { key: 'Transmission', value: transmission, units: '%' },
      ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}
