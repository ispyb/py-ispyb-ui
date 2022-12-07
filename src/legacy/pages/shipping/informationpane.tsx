import {
  faEdit,
  faExclamationTriangle,
  faInfoCircle,
  faPlaneDeparture,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { removeShipping, updateShippingStatus } from 'legacy/api/ispyb';
import axios from 'axios';
import SimpleParameterTable from 'legacy/components/table/simpleparametertable';
import { formatDateTo } from 'legacy/helpers/dateparser';
import { useState } from 'react';
import { Row, Col, Badge, Alert, Button, Spinner } from 'react-bootstrap';
import { KeyedMutator } from 'swr';
import { Container, Shipping } from './model';

import './informationpane.scss';
import { EditShippingModal } from './shipmenteditmodal';
import _ from 'lodash';

export function InformationPane({
  shipping,
  proposalName,
  mutateShipping,
  mutateShipments,
}: {
  shipping: Shipping;
  proposalName: string;
  mutateShipping: KeyedMutator<Shipping>;
  mutateShipments: KeyedMutator<Container[]>;
}) {
  const [sendingShipment, setSendingShipment] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const onSendToFacility = () => {
    setSendingShipment(true);
    axios
      .get(
        updateShippingStatus({
          proposalName,
          shippingId: shipping.shippingId,
          status: 'Sent_to_ESRF',
        }).url
      )
      .then(
        () => {
          mutateShipping();
          mutateShipments();
          setSendingShipment(false);
        },
        () => {
          mutateShipping();
          mutateShipments();
          setSendingShipment(false);
        }
      );
  };
  const data = shipping.sessions.length
    ? {
        ...shipping,
        beamlineName: shipping.sessions[0].beamlineName,
        nbReimbDewars: shipping.sessions[0].nbReimbDewars,
        startDate: formatDateTo(shipping.sessions[0].startDate, 'yyyy-MM-dd'),
        fedexCode:
          shipping.sessions[0].proposalVO.code +
          '-' +
          shipping.sessions[0].proposalVO.number +
          '/' +
          shipping.sessions[0].beamlineName +
          '/' +
          formatDateTo(shipping.sessions[0].startDate, 'yyyy-MM-dd'),
      }
    : {
        ...shipping,
        beamlineName: '',
        nbReimbDewars: 0,
        startDate: '',
        fedexCode: '',
      };

  const isSendShipmentActive = !(
    shipping.dewarVOs.length === 0 ||
    _.filter(shipping.dewarVOs, function (o) {
      return o.dewarStatus === null || o.dewarStatus === undefined;
    }).length > 0
  );
  const isEditShipmentActive = shipping.shippingStatus !== 'processing';
  const isDeleteShipmentActive = shipping.shippingStatus !== 'processing';

  const [deleting, setDeleting] = useState(false);

  const onDelete = () => {
    setDeleting(true);
    const req = removeShipping({
      proposalName,
      shippingId: shipping.shippingId,
    });

    axios.get(req.url).then(
      () => {
        mutateShipping();
        mutateShipments();
        setDeleting(false);
      },
      () => {
        mutateShipping();
        mutateShipments();
        setDeleting(false);
      }
    );
  };

  return (
    <Col>
      <Row>
        <Col></Col>
        <Col md={'auto'}>
          <SimpleParameterTable
            parameters={[
              { key: 'Beamline', value: data.beamlineName },
              { key: 'Date', value: data.startDate },
              {
                key: 'Status',
                value: (
                  <Badge style={{ margin: 0, fontSize: 'small' }}>
                    {data.shippingStatus}
                  </Badge>
                ),
              },
            ]}
          ></SimpleParameterTable>
        </Col>
        <Col></Col>
        <Col md={'auto'}>
          <SimpleParameterTable
            parameters={[
              {
                key: 'Sender address',
                value: data.sendingLabContactVO.cardName,
              },
              {
                key: 'Return address',
                value: data.returnLabContactVO.cardName,
              },
              {
                key: 'Fedex reference',
                value: (
                  <Badge style={{ margin: 0, fontSize: 'small' }}>
                    {data.fedexCode}
                  </Badge>
                ),
              },
            ]}
          ></SimpleParameterTable>
        </Col>
        <Col></Col>
        <Col md={'auto'}>
          <SimpleParameterTable
            parameters={[
              { key: 'Allowed reimb. parcels', value: data.nbReimbDewars },
              {
                key: 'Courier company',
                value: data.returnLabContactVO.defaultCourrierCompany,
              },
              {
                key: 'Billing reference',
                value: data.returnLabContactVO.billingReference,
              },
            ]}
          ></SimpleParameterTable>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col style={{ marginLeft: 20 }}>
          <Row>
            <strong>Comments:</strong>
          </Row>
          <Row>
            <span>{data.comments ? data.comments : 'none'}</span>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          {data.nbReimbDewars && data.nbReimbDewars > 0 ? (
            <Alert variant="info" style={{ margin: 15 }}>
              <FontAwesomeIcon
                style={{ marginRight: 10 }}
                icon={faInfoCircle}
              ></FontAwesomeIcon>
              According to the A-form, you are allowed to have{' '}
              <strong>
                {data.nbReimbDewars} parcels reimbursed by the ESRF
              </strong>
              . Please use the Reimburse button to select/unselect the parcels
              to be reimbursed.
            </Alert>
          ) : (
            <></>
          )}
          {!isSendShipmentActive ? (
            <Alert variant="warning" style={{ margin: 15 }}>
              <strong>
                <FontAwesomeIcon
                  style={{ marginRight: 10 }}
                  icon={faExclamationTriangle}
                ></FontAwesomeIcon>
                One of your labels is not printed
              </strong>
            </Alert>
          ) : (
            <></>
          )}
        </Col>
      </Row>
      <Row style={{ marginBottom: 10 }}>
        <Col md="auto" style={{ paddingRight: 0 }}>
          <Button
            disabled={!isSendShipmentActive || sendingShipment}
            style={{ marginLeft: 15 }}
            onClick={onSendToFacility}
          >
            {sendingShipment && (
              <Spinner
                style={{ marginRight: 10 }}
                size="sm"
                animation={'border'}
              ></Spinner>
            )}
            {!sendingShipment && (
              <FontAwesomeIcon
                style={{ marginRight: 10 }}
                icon={faPlaneDeparture}
              ></FontAwesomeIcon>
            )}
            Send shipment to the facility
          </Button>
        </Col>
        <Col md="auto" style={{ padding: 0 }}>
          <Button
            disabled={!isEditShipmentActive}
            style={{ marginLeft: 15 }}
            onClick={() => setShowEditModal(true)}
          >
            <FontAwesomeIcon
              style={{ marginRight: 10 }}
              icon={faEdit}
            ></FontAwesomeIcon>
            Edit
          </Button>
          <EditShippingModal
            shipping={shipping}
            proposalName={proposalName}
            mutateShipping={mutateShipping}
            mutateShipments={mutateShipments}
            show={showEditModal}
            setShow={setShowEditModal}
          ></EditShippingModal>
        </Col>
        <Col md="auto" style={{ padding: 0 }}>
          <Button
            onClick={onDelete}
            disabled={!isDeleteShipmentActive || deleting}
            style={{ marginLeft: 15 }}
          >
            {!deleting && (
              <FontAwesomeIcon
                style={{ marginRight: 10 }}
                icon={faTrash}
              ></FontAwesomeIcon>
            )}
            {deleting && (
              <Spinner
                size="sm"
                animation="border"
                style={{ marginRight: 10 }}
              ></Spinner>
            )}
            Delete
          </Button>
        </Col>
        <Col></Col>
      </Row>
    </Col>
  );
}
