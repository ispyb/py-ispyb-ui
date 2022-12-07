import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import { formatDateTo } from 'legacy/helpers/dateparser';
import { useShippingHistory } from 'legacy/hooks/ispyb';
import _ from 'lodash';
import { Row, Alert, Col, Badge } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
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
                    formatDateTo(shipping.dateOfShippingToUser, 'yyyy-MM-dd') ||
                    'unknown',
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
  );
}

export function DewarTransport({
  history,
}: {
  history: DewarTransportHistory;
}) {
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
        <Col>
          <BootstrapTable
            bootstrap4
            wrapperClasses="table-responsive"
            keyField="date"
            data={history.steps}
            striped
            columns={[
              {
                text: 'date',
                dataField: 'DewarTransportHistory_arrivalDate',
                formatter: (cell) => formatDateTo(cell, 'yyyy-MM-dd HH:mm'),
                style: { backgroundColor: 'white' },
                headerStyle: { backgroundColor: 'white' },
              },
              {
                text: 'status',
                dataField: 'DewarTransportHistory_dewarStatus',
                formatter: (cell) => <Badge>{cell}</Badge>,
                style: { backgroundColor: 'white' },
                headerStyle: { backgroundColor: 'white' },
              },
              {
                text: 'location',
                dataField: 'DewarTransportHistory_storageLocation',
                style: { backgroundColor: 'white' },
                headerStyle: { backgroundColor: 'white' },
              },
            ]}
          ></BootstrapTable>
        </Col>
      </Row>
    </Alert>
  );
}
