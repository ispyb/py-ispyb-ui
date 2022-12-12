import { ElementType } from 'react';
import { Button, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import { LabContact } from './model';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { KeyedMutator } from 'swr';
import produce from 'immer';
import axios from 'axios';
import { updateLabContact } from 'legacy/api/ispyb';

export default function AddressModal({
  show,
  onHide,
  address,
  mutate,
  proposalName,
}: {
  show: boolean;
  onHide: () => void;
  address: LabContact;
  mutate: KeyedMutator<LabContact[]>;
  proposalName: string;
}) {
  return (
    <Modal
      backdrop="static"
      keyboard={false}
      onHide={onHide}
      show={show}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit address
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ModalContent
          close={onHide}
          address={address}
          mutate={mutate}
          proposalName={proposalName}
        ></ModalContent>
      </Modal.Body>
    </Modal>
  );
}

export function ModalContent({
  address,
  close,
  mutate,
  proposalName,
}: {
  address: LabContact;
  close: () => void;
  mutate: KeyedMutator<LabContact[]>;
  proposalName: string;
}) {
  return (
    <AddressForm
      close={close}
      address={address}
      mutate={mutate}
      proposalName={proposalName}
    ></AddressForm>
  );
}

type FormType = {
  cardName: string;

  givenName: string;
  familyName: string;

  emailAddress: string;
  phoneNumber: string;
  faxNumber: string;

  courierAccount: string;
  defaultCourrierCompany: string;

  dewarAvgCustomsValue: string;
  dewarAvgTransportValue: string;
  billingReference: string;

  labName: string;
  labAddress: string;
};

const schema = Yup.object().shape({
  cardName: Yup.string().required('Mandatory field').max(40, 'Too long'),

  givenName: Yup.string().max(45, 'Too long'),
  familyName: Yup.string().max(100, 'Too long'),

  emailAddress: Yup.string().email('Valid email required').max(60, 'Too long'),
  phoneNumber: Yup.string().max(45, 'Too long'),
  faxNumber: Yup.string().max(45, 'Too long'),

  courierAccount: Yup.string().max(45, 'Too long'),
  defaultCourrierCompany: Yup.string().max(45, 'Too long'),

  dewarAvgCustomsValue: Yup.number()
    .integer()
    .min(0, 'Should be >=0')
    .required('Mandatory field')
    .typeError('A number is required'),
  dewarAvgTransportValue: Yup.number()
    .integer()
    .min(0, 'Should be >=0')
    .required('Mandatory field')
    .typeError('A number is required'),
  billingReference: Yup.string().max(45, 'Too long'),

  labName: Yup.string().max(45, 'Too long'),
  labAddress: Yup.string().max(45, 'Too long'),
});

export function AddressForm({
  address,
  close,
  mutate,
  proposalName,
}: {
  address: LabContact;
  close: () => void;
  mutate: KeyedMutator<LabContact[]>;
  proposalName: string;
}) {
  const initialValues: FormType = {
    cardName: address.cardName,

    givenName: address.personVO.givenName,
    familyName: address.personVO.familyName,

    emailAddress: address.personVO.emailAddress,
    phoneNumber: address.personVO.phoneNumber,
    faxNumber: address.personVO.faxNumber,

    courierAccount: address.courierAccount,
    defaultCourrierCompany: address.defaultCourrierCompany,

    dewarAvgCustomsValue: String(address.dewarAvgCustomsValue),
    dewarAvgTransportValue: String(address.dewarAvgTransportValue),
    billingReference: address.billingReference,

    labName: address.personVO.laboratoryVO.name,
    labAddress: address.personVO.laboratoryVO.address,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={function (values) {
        const next = produce(address, (draft) => {
          draft.cardName = values.cardName;

          draft.personVO.givenName = values.givenName;
          draft.personVO.familyName = values.familyName;

          draft.personVO.emailAddress = values.emailAddress;
          draft.personVO.phoneNumber = values.phoneNumber;
          draft.personVO.faxNumber = values.faxNumber;

          draft.courierAccount = values.courierAccount;
          draft.defaultCourrierCompany = values.defaultCourrierCompany;

          draft.dewarAvgCustomsValue = Number(values.dewarAvgCustomsValue);
          draft.dewarAvgTransportValue = Number(values.dewarAvgTransportValue);
          draft.billingReference = values.billingReference;

          draft.personVO.laboratoryVO.name = values.labName;
          draft.personVO.laboratoryVO.address = values.labAddress;
        });
        const req = updateLabContact({ proposalName, data: next });
        axios.post(req.url, req.data, { headers: req.headers }).then(
          () => {
            mutate();
          },
          () => {
            mutate();
          }
        );
        close();
        return;
      }}
    >
      {(formikProps) => (
        <Form noValidate onSubmit={formikProps.handleSubmit}>
          <Row className="mb-3">
            <FormInput
              name="Address name"
              field="cardName"
              formikProps={formikProps}
            ></FormInput>
          </Row>
          <Row className="mb-3">
            <FormInput
              name="First name"
              field="givenName"
              formikProps={formikProps}
            ></FormInput>
            <FormInput
              name="Surname"
              field="familyName"
              formikProps={formikProps}
            ></FormInput>
          </Row>
          <Row className="mb-3">
            <FormInput
              name="Email"
              field="emailAddress"
              formikProps={formikProps}
            ></FormInput>
            <FormInput
              name="Phone"
              field="phoneNumber"
              formikProps={formikProps}
            ></FormInput>
            <FormInput
              name="Fax"
              field="faxNumber"
              formikProps={formikProps}
            ></FormInput>
          </Row>
          <Row className="mb-3">
            <FormInput
              name="Courier account"
              field="courierAccount"
              formikProps={formikProps}
            ></FormInput>
            <FormInput
              name="Courier company"
              field="defaultCourrierCompany"
              formikProps={formikProps}
            ></FormInput>
          </Row>
          <Row className="mb-3">
            <FormInput
              name="Avg customs value"
              field="dewarAvgCustomsValue"
              formikProps={formikProps}
            ></FormInput>
            <FormInput
              name="Avg transport value"
              field="dewarAvgTransportValue"
              formikProps={formikProps}
            ></FormInput>
            <FormInput
              name="Billing reference"
              field="billingReference"
              formikProps={formikProps}
            ></FormInput>
          </Row>
          <Row className="mb-3">
            <FormInput
              name="Lab name"
              field="labName"
              formikProps={formikProps}
            ></FormInput>
          </Row>
          <Row className="mb-3">
            <FormInput
              name="Lab address"
              type={'textarea'}
              field="labAddress"
              formikProps={formikProps}
            ></FormInput>
          </Row>
          <Row>
            <Col></Col>
            <Col md={'auto'}>
              <Button
                disabled={!formikProps.isValid}
                variant="primary"
                type="submit"
              >
                Save
              </Button>
            </Col>
            <Col md={'auto'}>
              <Button variant="secondary" onClick={close}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}

export function FormInput({
  name,
  field,
  type,
  formikProps,
}: {
  name: string;
  field: keyof FormType;
  type?: ElementType;
  formikProps: FormikProps<FormType>;
}) {
  return (
    <Form.Group as={Col}>
      <Form.Label>{name}</Form.Label>
      <InputGroup hasValidation>
        <Form.Control
          type="text"
          as={type}
          placeholder={'none'}
          onChange={formikProps.handleChange}
          name={field}
          value={formikProps.values[field]}
          isInvalid={!!formikProps.errors[field]}
          style={{ height: type === 'textarea' ? 200 : undefined }}
        />
        <Form.Control.Feedback type="invalid">
          {formikProps.errors[field]}
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
}
