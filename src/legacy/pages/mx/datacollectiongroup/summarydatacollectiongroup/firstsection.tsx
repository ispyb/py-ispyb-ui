import { DataCollectionGroup } from 'legacy/pages/mx/model';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import { getDatasetParam, Dataset, getNotes } from 'legacy/hooks/icatmodel';

export default function FirstSection({
  dataCollectionGroup,
  compact = false,
}: {
  dataCollectionGroup: Dataset;
  compact?: boolean;
}) {
  const notes: DataCollectionGroup = getNotes(dataCollectionGroup);
  if (!notes) return null;
  const {
    Workflow_workflowType,
    Protein_acronym,
    BLSample_name,
    DataCollection_imagePrefix,
    DataCollection_numberOfImages,
    totalNumberOfImages,
    transmission,
    DataCollection_numberOfPasses,
  } = notes;
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
