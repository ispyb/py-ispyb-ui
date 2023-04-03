import { useMxDataCollectionsByGroupId } from 'legacy/hooks/ispyb';
import { DataCollection, DataCollectionGroup } from 'legacy/pages/mx/model';
import { useParams } from 'react-router-dom';
import { convertToFixed } from 'legacy/helpers/numerictransformation';
import ZoomImage from 'legacy/components/image/zoomimage';
import { getDozorPlot, updateCollectionComments } from 'legacy/api/ispyb';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TanstackBootstrapTable } from 'components/Layout/TanstackBootstrapTable';
import { formatDateToDayAndTime } from 'helpers/dateparser';
import { CopyValue } from 'components/Common/CopyValue';
import { Container } from 'react-bootstrap';
import { EditComments } from 'legacy/components/EditComments';

type Param = {
  proposalName: string;
};

function getColumns(proposalName: string): ColumnDef<DataCollection>[] {
  return [
    {
      header: 'Prefix',
      footer: 'Prefix',
      accessorKey: 'imagePrefix',
      cell: (info) => {
        return (
          <div style={{ fontSize: '0.8rem' }}>
            <CopyValue value={info.getValue() as string} />
          </div>
        );
      },
    },
    {
      header: 'Run',
      footer: 'Run',
      accessorKey: 'dataCollectionNumber',
      enableColumnFilter: false,
    },
    {
      header: '# Images',
      footer: '# Images',
      accessorKey: 'numberOfImages',
      enableColumnFilter: false,
    },
    {
      header: 'Exp. Time',
      footer: 'Exp. Time',
      accessorKey: 'exposureTime',
      enableColumnFilter: false,
    },
    {
      header: 'Res.(corner)',
      footer: 'Res.(corner)',
      accessorKey: 'resolution',
      enableColumnFilter: false,
      cell: (info) => {
        return (
          convertToFixed(info.row.original.resolution, 1) +
          ' Å (' +
          convertToFixed(info.row.original.resolutionAtCorner, 1) +
          'Å)'
        );
      },
    },
    {
      header: 'Time',
      footer: 'Time',
      accessorKey: 'startTime',
      cell: (info) => formatDateToDayAndTime(info.getValue() as string),
      enableColumnFilter: false,
    },
    {
      header: 'Status',
      footer: 'Status',
      accessorKey: 'runStatus',
      enableColumnFilter: false,
    },
    {
      header: 'Indicators',
      footer: 'Indicators',
      accessorKey: 'Indicators',
      cell: (info) => {
        return (
          <ZoomImage
            alt="indicator"
            style={{ maxWidth: 110 }}
            src={
              getDozorPlot({
                dataCollectionId: info.row.original.dataCollectionId,
                proposalName,
              }).url
            }
          />
        );
      },
      enableColumnFilter: false,
    },
    {
      header: 'Phasing',
      footer: 'Phasing',
      accessorKey: 'hasPhasing',
      enableColumnFilter: false,
    },
    {
      header: 'Comments',
      footer: 'Comments',
      accessorKey: 'comments',
      cell: (info) => {
        return (
          <EditComments
            comments={(info.getValue() as string) || ''}
            proposalName={proposalName}
            id={info.row.original.dataCollectionId?.toString() || ''}
            saveReq={updateCollectionComments}
          />
        );
      },
    },
  ];
}

export default function CollectionsDataCollectionGroupPanel({
  dataCollectionGroup,
}: {
  dataCollectionGroup: DataCollectionGroup;
}) {
  const { proposalName = '' } = useParams<Param>();
  const {
    data: dataCollections,
    isError,
    isLoading,
  }: {
    data: DataCollection[];
    isError: string;
    isLoading: boolean;
  } = useMxDataCollectionsByGroupId({
    proposalName,
    dataCollectionGroupId: `${dataCollectionGroup.DataCollection_dataCollectionGroupId}`,
  });

  const table = useReactTable({
    data: dataCollections,
    columns: getColumns(proposalName),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  if (isLoading) return <></>;
  if (isError) throw Error(isError);
  return (
    <Container fluid>
      <TanstackBootstrapTable table={table} />
    </Container>
  );
}
