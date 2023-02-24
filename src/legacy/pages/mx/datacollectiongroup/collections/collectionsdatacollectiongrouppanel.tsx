import { useMxDataCollectionsByGroupId } from 'legacy/hooks/ispyb';
import { DataCollection, DataCollectionGroup } from 'legacy/pages/mx/model';
import { useParams } from 'react-router-dom';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable, { ColumnDescription } from 'react-bootstrap-table-next';
import { convertToFixed } from 'legacy/helpers/numerictransformation';
import ZoomImage, { ZoomImageIcat } from 'legacy/components/image/zoomimage';
import { getDozorPlot } from 'legacy/api/ispyb';
import { useSubDatasets } from 'legacy/hooks/icat';
import { Dataset, getNotes } from 'legacy/hooks/icatmodel';

type Param = {
  proposalName: string;
};

function getColumns(proposalName: string): ColumnDescription<DataCollection>[] {
  return [
    {
      text: 'Prefix',
      dataField: 'imagePrefix',
    },
    {
      text: 'Run',
      dataField: 'dataCollectionNumber',
    },
    {
      text: '# Images',
      dataField: 'numberOfImages',
    },
    {
      text: 'Exp. Time',
      dataField: 'exposureTime',
    },
    {
      text: 'Res.(corner)',
      dataField: 'resolution',
      formatter: function (cell, row) {
        return (
          convertToFixed(row.resolution, 1) +
          ' Å (' +
          convertToFixed(row.resolutionAtCorner, 1) +
          'Å)'
        );
      },
    },
    {
      text: 'Folder',
      dataField: 'folder',
      formatter: function () {
        return '-';
      },
    },
    {
      text: 'Time',
      dataField: 'startTime',
    },
    {
      text: 'Status',
      dataField: 'runStatus',
    },
    {
      text: 'Indicators',
      dataField: 'Indicators',
      formatter: function (cell, row) {
        const dataset = (row as any)['dataset'] as Dataset;
        return (
          <ZoomImageIcat
            style={{ maxWidth: 110 }}
            dataset={dataset}
            index={0}
          />
        );
      },
    },
    {
      text: 'View Results',
      dataField: 'View Result',
      formatter: function () {
        return '-';
      },
    },
    {
      text: 'Phasing',
      dataField: 'hasPhasing',
    },
    {
      text: 'Comments',
      dataField: 'comments',
    },
  ];
}

export default function CollectionsDataCollectionGroupPanel({
  dataCollectionGroup,
}: {
  dataCollectionGroup: Dataset;
}) {
  const { proposalName = '' } = useParams<Param>();

  const { data } = useSubDatasets({
    dataset: dataCollectionGroup,
    type: 'datacollection',
  });
  const dataCollections = data.map((d) => getNotes<DataCollection>(d));

  return (
    <BootstrapTable
      bootstrap4
      wrapperClasses="table-responsive"
      keyField="dataCollectionId"
      data={dataCollections}
      columns={getColumns(proposalName)}
    />
  );
}
