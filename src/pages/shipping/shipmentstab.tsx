import { dateToTimestamp, formatDateTo } from 'helpers/dateparser';
import { useShipments } from 'hooks/ispyb';
import _, { sum } from 'lodash';
import { Row, Col, Badge, InputGroup, FormControl } from 'react-bootstrap';
import { Parcel, Shipment } from './model';
import './shipmentstab.scss';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ShipmentView } from './shipmentview';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
export function ShipmentsTab({ proposalName }: { proposalName: string }) {
  const { data = [], isError } = useShipments({ proposalName });
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Shipment | undefined>(undefined);

  console.log(selected);

  if (isError) throw Error(isError);

  const shipments: Shipment[] = _(data)
    .groupBy((i) => i.Shipping_shippingId)
    .map((cs) => {
      const containers = [...cs.values()];
      const sampleCount = sum(containers.map((c) => c.sampleCount));
      const parcels: Parcel[] = _(containers)
        .groupBy((i) => i.Dewar_dewarId)
        .map((cs) => {
          const containers = [...cs.values()];
          const sampleCount = sum(containers.map((c) => c.sampleCount));
          return { ...containers[0], containers, sampleCount };
        })
        .value();
      const parcelCount = parcels.length;
      return { ...parcels[0], parcels, sampleCount, parcelCount };
    })
    .value();

  const filteredShipments = shipments
    .filter((v) => {
      return (
        (v.Shipping_shippingName && v.Shipping_shippingName.toLowerCase().includes(search.toLowerCase())) ||
        (v.Shipping_shippingStatus && v.Shipping_shippingStatus.toLowerCase().includes(search.toLowerCase())) ||
        (v.Shipping_creationDate && formatDateTo(v.Shipping_creationDate, 'dd/MM/yyyy').includes(search))
      );
    })
    .sort((a, b) => {
      return dateToTimestamp(b.Shipping_creationDate) - dateToTimestamp(a.Shipping_creationDate);
    });

  return (
    <Row>
      <Col md="auto">
        <Row>
          <InputGroup style={{ margin: 5 }}>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
            </InputGroup.Text>
            <FormControl placeholder={`search ${shipments.length} shipments...`} value={search} onChange={(e) => setSearch(e.target.value)} />
          </InputGroup>
        </Row>
        <Row style={{ height: '80vh', overflowY: 'scroll' }}>
          <Col>
            {filteredShipments.map((s) => (
              <ShipmentCard
                onClick={() => setSelected(s)}
                proposalName={proposalName}
                shipment={s}
                selected={s.Shipping_shippingId === selected?.Shipping_shippingId}
              ></ShipmentCard>
            ))}
          </Col>
        </Row>
      </Col>
      <Col>
        <ShipmentView proposalName={proposalName} shipment={selected}></ShipmentView>
      </Col>
    </Row>
  );
}

export function ShipmentCard({ shipment, selected, onClick }: { proposalName: string; shipment: Shipment; selected: boolean; onClick: () => void }) {
  return (
    <Row onClick={onClick} className={`shipmentCard ${selected ? 'shipmentCardSelected' : ''}`}>
      <Col>
        <Row>
          <div className="shipmentCardName">{shipment.Shipping_shippingName}</div>
        </Row>
        <Row>
          <div className="shipmentCardDate">{formatDateTo(shipment.Shipping_creationDate, 'dd/MM/yyyy') || 'unknown date'}</div>
        </Row>
        <Row>
          <div className="shipmentCardCount">
            {shipment.parcelCount} parcels ({shipment.sampleCount} samples)
          </div>
        </Row>
      </Col>
      <Col md="auto">
        <Badge bg={shipment.Shipping_shippingStatus?.toLowerCase() === 'processing' ? 'warning' : 'primary'}>{shipment.Shipping_shippingStatus}</Badge>
      </Col>
    </Row>
  );
}
