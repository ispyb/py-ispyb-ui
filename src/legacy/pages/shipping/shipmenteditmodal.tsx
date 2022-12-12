import './shipmenteditmodal.scss';
import Select from 'react-select';
import { useLabContacts, useSessions } from 'legacy/hooks/ispyb';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Modal,
  Row,
  Col,
  InputGroup,
  Button,
  Form,
  Spinner,
} from 'react-bootstrap';
import { KeyedMutator } from 'swr';
import { Shipping, LabContact, Container } from './model';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Session } from 'legacy/pages/model';
import { formatDateTo } from 'legacy/helpers/dateparser';
import { saveShipment, SaveShipmentData } from 'legacy/api/ispyb';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

export function EditShippingModal({
  shipping = undefined,
  proposalName,
  mutateShipping = undefined,
  mutateShipments,
  show,
  setShow,
}: {
  shipping?: Shipping;
  proposalName: string;
  mutateShipping?: KeyedMutator<Shipping>;
  mutateShipments: KeyedMutator<Container[]>;
  show: boolean;
  // eslint-disable-next-line no-unused-vars
  setShow: (_: boolean) => void;
}) {
  const { data: contacts = [], isError: isErrorContacts } = useLabContacts({
    proposalName,
  });
  if (isErrorContacts) throw Error(isErrorContacts);

  const { data: sessions = [], isError: isErrorSessions } = useSessions({
    proposalName,
  });
  if (isErrorSessions) throw Error(isErrorSessions);

  const [formKey, setFormKey] = useState(uuidv4());

  useEffect(() => {
    setFormKey(uuidv4());
  }, [shipping, show]);

  const [saving, setSaving] = useState(false);

  type Option = {
    value: number;
    label: string;
  };

  function getContactOption(shippingContact?: LabContact): Option | undefined {
    return shippingContact
      ? {
          value: shippingContact.labContactId,
          label: shippingContact.cardName,
        }
      : undefined;
  }

  function getSessionOption(session?: Session): Option | undefined {
    return session
      ? {
          value: session.sessionId,
          label: `${formatDateTo(
            session.BLSession_startDate,
            'dd/MM/yyyy'
          )} - ${session.beamLineName}`,
        }
      : undefined;
  }

  function getShippingSessionOption(shipping?: Shipping): Option | undefined {
    if (shipping && shipping.sessions.length) {
      return {
        value: shipping.sessions[0].sessionId,
        label: `${formatDateTo(
          shipping.sessions[0].startDate,
          'dd/MM/yyyy'
        )} - ${shipping.sessions[0].beamlineName}`,
      };
    }
    return undefined;
  }

  const addressOptions = contacts
    .map(getContactOption)
    .filter((v) => v) as Option[];
  const sessionOptions = sessions
    .map(getSessionOption)
    .filter((v) => v) as Option[];

  type FormType = {
    name?: string;
    session?: Option;
    comments?: string;
    from?: Option;
    return?: Option;
  };

  const formSchema = Yup.object().shape({
    name: Yup.string().required('Mandatory field').max(40, 'Too long'),
    comments: Yup.string().max(255, 'Too long'),
  });

  const initialValues: FormType = {
    name: shipping?.shippingName,
    comments: shipping?.comments,
    session: getShippingSessionOption(shipping),
    from: getContactOption(shipping?.sendingLabContactVO),
    return: getContactOption(shipping?.returnLabContactVO),
  };

  return (
    <Formik
      validationSchema={formSchema}
      initialValues={initialValues}
      key={formKey}
      onSubmit={(values) => {
        setSaving(true);

        const data: SaveShipmentData = {
          shippingId: shipping?.shippingId,
          name: values.name,
          status: shipping?.shippingStatus,
          sendingLabContactId: values.from?.value,
          returnLabContactId: values.return?.value,
          returnCourier: values.return?.value,
          courierAccount: undefined,
          billingReference: undefined,
          dewarAvgCustomsValue: 0,
          dewarAvgTransportValue: 0,
          comments: values.comments,
          sessionId: values.session?.value,
        };
        const req = saveShipment({ proposalName, data });

        axios.post(req.url, req.data, { headers: req.headers }).then(
          () => {
            mutateShipping && mutateShipping();
            mutateShipments();
            setSaving(false);
            setShow(false);
          },
          () => {
            mutateShipping && mutateShipping();
            mutateShipments();
            setSaving(false);
            setShow(false);
          }
        );

        return;
      }}
    >
      {(formikProps) => (
        <Modal
          centered
          backdrop="static"
          keyboard={false}
          show={show}
          onHide={() => setShow(false)}
        >
          <Modal.Header closeButton={!saving}>
            <Modal.Title>
              {shipping ? 'Edit shipment' : 'New shipment'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate onSubmit={formikProps.handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Name</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      placeholder={'none'}
                      onChange={formikProps.handleChange}
                      name={'name'}
                      value={formikProps.values['name']}
                      isInvalid={!!formikProps.errors['name']}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors['name']}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Session</Form.Label>
                  <InputGroup hasValidation>
                    <Select
                      isClearable={true}
                      name="session"
                      isSearchable={true}
                      className="addressSelect"
                      value={formikProps.values['session']}
                      options={sessionOptions}
                      onChange={(newValue) => {
                        formikProps.setFieldValue('session', newValue);
                      }}
                    ></Select>
                  </InputGroup>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Comments</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      as="textarea"
                      placeholder={'none'}
                      onChange={formikProps.handleChange}
                      name={'comments'}
                      value={formikProps.values['comments']}
                      isInvalid={!!formikProps.errors['comments']}
                      style={{ height: 100 }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors['comments']}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>From</Form.Label>
                  <InputGroup hasValidation>
                    <Select
                      name="from"
                      isSearchable={true}
                      className="addressSelect"
                      value={formikProps.values['from']}
                      options={addressOptions}
                      onChange={(newValue) => {
                        newValue && formikProps.setFieldValue('from', newValue);
                      }}
                    ></Select>
                  </InputGroup>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Return</Form.Label>
                  <InputGroup hasValidation>
                    <Select
                      name="return"
                      isSearchable={true}
                      className="addressSelect"
                      value={formikProps.values['return']}
                      options={addressOptions}
                      onChange={(newValue) => {
                        newValue &&
                          formikProps.setFieldValue('return', newValue);
                      }}
                    ></Select>
                  </InputGroup>
                </Form.Group>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={saving}
              variant="secondary"
              onClick={() => setShow(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={saving}
              variant="primary"
              onClick={formikProps.submitForm}
            >
              {saving && (
                <Spinner
                  size="sm"
                  style={{ marginRight: 10 }}
                  animation="border"
                ></Spinner>
              )}
              {!saving && (
                <FontAwesomeIcon
                  icon={faSave}
                  size="sm"
                  style={{ marginRight: 10 }}
                ></FontAwesomeIcon>
              )}
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Formik>
  );
}
