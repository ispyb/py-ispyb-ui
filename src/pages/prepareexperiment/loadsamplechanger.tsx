import { ContainerDewar } from 'pages/model';
import { Card } from 'react-bootstrap';

import './loadsamplechanger.scss';

import { useBeamlinesObjects } from 'hooks/site';
import DnDLoadSampleChanger from './dndloadsamplechanger';

export default function LoadSampleChanger({
  dewars,
  proposalName,
  setContainerPosition,
}: {
  dewars?: ContainerDewar[];
  proposalName: string;
  // eslint-disable-next-line no-unused-vars
  setContainerPosition: (containerId: number, beamline: string, position: string) => void;
}) {
  const beamlines = useBeamlinesObjects('MX');

  return (
    <Card>
      <Card.Header>2. Load sample changer</Card.Header>
      <Card.Body>
        <DnDLoadSampleChanger beamlines={beamlines} setContainerPosition={setContainerPosition} proposalName={proposalName} dewars={dewars}></DnDLoadSampleChanger>
      </Card.Body>
    </Card>
  );
}

// // eslint-disable-next-line no-unused-vars
// export function ContainerTable({ dewars, setContainer, selected }: { dewars: Dewar[]; setContainer: (c: Dewar) => void; selected?: Dewar }) {
//   const columns: ColumnDescription<Dewar>[] = [
//     { text: 'id', dataField: 'containerId', hidden: true },
//     {
//       text: 'Shipment',
//       dataField: 'shippingName',
//       filter: textFilter({
//         placeholder: 'Search...',
//       }),
//     },
//     {
//       text: 'Container',
//       dataField: 'containerCode',
//       filter: textFilter({
//         placeholder: 'Search...',
//       }),
//     },
//     {
//       text: 'Type',
//       dataField: 'containerType',
//       filter: textFilter({
//         placeholder: 'Search...',
//       }),
//     },
//     {
//       text: 'Beamline',
//       dataField: 'beamlineLocation',
//       filter: textFilter({
//         placeholder: 'Search...',
//       }),
//     },
//     {
//       text: 'Cell',
//       dataField: 'sampleChangerLocation',
//       formatter: (cell) => {
//         if (!cell || isNaN(Number(cell))) {
//           return '';
//         }
//         return `${Math.floor(Number(cell) / 3) + 1}`;
//       },
//       hidden: false,
//     },
//     {
//       text: 'Position',
//       dataField: 'sampleChangerLocation',
//       formatter: (cell) => {
//         if (!cell || isNaN(Number(cell))) {
//           return '';
//         }
//         return `${Number(cell) % 3}`;
//       },
//       hidden: false,
//     },
//     {
//       text: '',
//       dataField: 'shippingId',
//       formatter: (cell, row) => {
//         return <SelectContainer container={row} setContainer={setContainer}></SelectContainer>;
//       },
//       headerStyle: { width: 40 },
//       style: { verticalAlign: 'middle', textAlign: 'center' },
//     },
//   ];

//   return (
//     <Col>
//       <Row>
//         <BootstrapTable
//           bootstrap4
//           wrapperClasses="table-responsive"
//           keyField="Id"
//           data={dewars}
//           columns={columns}
//           condensed
//           striped
//           rowClasses={(row: Dewar) => {
//             return row.containerId == selected?.containerId ? 'selectedforplacement' : '';
//           }}
//           pagination={paginationFactory({ sizePerPage: 5, showTotal: true, hideSizePerPage: true, hidePageListOnlyOnePage: true })}
//           filter={filterFactory()}
//         />
//       </Row>
//     </Col>
//   );
// }
