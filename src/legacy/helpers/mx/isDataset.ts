import { DataCollectionGroup } from 'legacy/pages/mx/model';

export function isDataset(dcg: DataCollectionGroup) {
  return (
    dcg.scalingStatisticsTypes || //If processed then it is a dataset
    (dcg.DataCollection_runStatus?.toLowerCase().includes('successful') && //If not processed then it is a dataset if it is successful
      !['mesh', 'line', 'ref'].includes(
        //If not processed then it is a dataset if it is not a mesh, line or ref
        dcg.DataCollection_imagePrefix?.trim().toLowerCase().split('-')[0] || ''
      ))
  );
}
