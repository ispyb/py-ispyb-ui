import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TanstackBootstrapTable } from 'components/Layout/TanstackBootstrapTable';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import { formatDateTo } from 'legacy/helpers/dateparser';
import { useShippingHistory } from 'legacy/hooks/ispyb';
import _ from 'lodash';
import { Row, Alert, Col, Badge, Container } from 'react-bootstrap';
import { Shipping, ShippingHistory, ShippingHistoryEntry } from './model';
import './transportpane.scss';

type DewarTransportHistory = ShippingHistoryEntry & { steps: ShippingHistory };

export function TransportPane({
  shipping,
  proposalName,
}: {
  shipping: Shipping;
  proposalName: string;
}) {
  const { data, isError } = useShippingHistory({
    proposalName,
    shippingId: shipping.shippingId,
  });

  if (isError) throw Error(isError);

  if (!data) {
    return (
      <Row style={{ margin: 10 }}>
        <Alert variant="warning">
          <FontAwesomeIcon
            style={{ marginRight: 10 }}
            icon={faQuestionCircle}
          ></FontAwesomeIcon>
          Could not find history for selected shipping
        </Alert>
      </Row>
    );
  }

  const grouped: DewarTransportHistory[] = _(data)
    .groupBy((v) => v.Dewar_dewarId)
    .map((group) => {
      const refValue = group[0];
      return { ...refValue, steps: group };
    })
    .sort((a, b) => a.Dewar_dewarId - b.Dewar_dewarId)
    .value();

  return (
    <Container fluid>
      <Col>
        <Row style={{ margin: 10 }}>
          <Col></Col>
          <Col md={'auto'}>
            <div className="historyParameterTable">
              <SimpleParameterTable
                parameters={[
                  {
                    key: 'Creation date',
                    value:
                      formatDateTo(shipping.creationDate, 'yyyy-MM-dd') ||
                      'unknown',
                  },
                ]}
              ></SimpleParameterTable>
            </div>
          </Col>
          <Col></Col>
          <Col md={'auto'}>
            <div className="historyParameterTable">
              <SimpleParameterTable
                parameters={[
                  {
                    key: 'Sending date',
                    value:
                      formatDateTo(
                        shipping.deliveryAgentShippingDate,
                        'yyyy-MM-dd'
                      ) || 'unknown',
                  },
                ]}
              ></SimpleParameterTable>
            </div>
          </Col>
          <Col></Col>
          <Col md={'auto'}>
            <div className="historyParameterTable">
              <SimpleParameterTable
                parameters={[
                  {
                    key: 'Expected arrival date',
                    value:
                      formatDateTo(
                        shipping.deliveryAgentDeliveryDate,
                        'yyyy-MM-dd'
                      ) || 'unknown',
                  },
                ]}
              ></SimpleParameterTable>
            </div>
          </Col>
          <Col></Col>
          <Col md={'auto'}>
            <div className="historyParameterTable">
              <SimpleParameterTable
                parameters={[
                  {
                    key: 'Return date',
                    value:
                      formatDateTo(
                        shipping.dateOfShippingToUser,
                        'yyyy-MM-dd'
                      ) || 'unknown',
                  },
                ]}
              ></SimpleParameterTable>
            </div>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>
            {grouped.map((group) => {
              return (
                <DewarTransport
                  key={group.Dewar_dewarId}
                  history={group}
                ></DewarTransport>
              );
            })}
          </Col>
        </Row>
      </Col>
    </Container>
  );
}

export function DewarTransport({
  history,
}: {
  history: DewarTransportHistory;
}) {
  const columns: ColumnDef<ShippingHistoryEntry>[] = [
    {
      header: 'date',
      footer: 'date',
      accessorFn: (row) =>
        formatDateTo(row.DewarTransportHistory_arrivalDate, 'yyyy-MM-dd HH:mm'),
      enableColumnFilter: false,
    },

    {
      header: 'status',
      footer: 'status',
      accessorKey: 'DewarTransportHistory_dewarStatus',
      cell: (info) => <Badge>{info.getValue() as string}</Badge>,
      enableColumnFilter: false,
    },
    {
      header: 'location',
      footer: 'location',
      accessorKey: 'DewarTransportHistory_storageLocation',
      enableColumnFilter: false,
    },
  ];
  const table = useReactTable({
    data: history.steps,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });
  return (
    <Alert style={{ margin: 10 }} variant="light">
      <Row>
        <Col md={'auto'}>
          <div className="historyParameterTable">
            <SimpleParameterTable
              parameters={[
                { key: 'Name', value: history.Dewar_code },
                { key: 'Barcode', value: history.Dewar_barCode },
                { key: 'Outbound courier', value: '' },
                {
                  key: 'Outbound tracking number',
                  value: history.Dewar_trackingNumberToSynchrotron,
                },
                {
                  key: 'Return courier',
                  value: history.Shipping_returnCourier,
                },
                {
                  key: 'Return tracking number',
                  value: history.Dewar_trackingNumberFromSynchrotron,
                },
              ]}
            ></SimpleParameterTable>
          </div>
        </Col>
        <Col style={{ backgroundColor: 'white', padding: '1rem' }}>
          <TanstackBootstrapTable table={table} />
        </Col>
      </Row>
    </Alert>
  );
}
