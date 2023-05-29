import { DataCollectionGroup } from 'legacy/pages/mx/model';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';

export function ParametersInfo({
  dataCollectionGroup,
  compact = false,
}: {
  dataCollectionGroup: DataCollectionGroup;
  compact?: boolean;
}) {
  const {
    Protein_acronym,
    BLSample_name,
    DataCollection_imagePrefix,
    DataCollection_numberOfImages,
    totalNumberOfImages,
    transmission,
    DataCollection_dataCollectionNumber,
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
        { key: 'Protein', value: Protein_acronym },
        { key: 'Sample', value: BLSample_name },
        { key: 'Prefix', value: DataCollection_imagePrefix },
        { key: 'Run', value: DataCollection_dataCollectionNumber },
        {
          key: '# Images (Total)',
          value: `${DataCollection_numberOfImages} (${totalNumberOfImages})`,
        },
        { key: 'Transmission', value: transmission, units: '%' },
      ];
  return <SimpleParameterTable parameters={parameters}></SimpleParameterTable>;
}
