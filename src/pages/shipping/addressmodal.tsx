import LoadingPanel from 'components/loading/loadingpanel';
import { ElementType, Suspense, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { LabContact } from './model';

export default function AddressModal({ show, onHide, address }: { show: boolean; onHide: () => void; address: LabContact }) {
  return (
    <Modal backdrop="static" keyboard={false} onHide={onHide} show={show} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Edit address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {show && (
          <Suspense fallback={<LoadingPanel></LoadingPanel>}>
            <ModalContent address={address}></ModalContent>
          </Suspense>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Save
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export function ModalContent({ address }: { address: LabContact }) {
  return <AddressForm address={address}></AddressForm>;
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

export function AddressForm({ address }: { address: LabContact }) {
  const initialState: FormType = {
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
  const [formData, setFormData] = useState(initialState);

  const updateFormProperty = (field: keyof FormType, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <Form noValidate>
      <Row className="mb-3">
        <FormInput name="Address name" field="cardName" formData={formData} updateFormProperty={updateFormProperty}></FormInput>
      </Row>
      <Row className="mb-3">
        <FormInput name="First name" field="givenName" formData={formData} updateFormProperty={updateFormProperty}></FormInput>
        <FormInput name="Surname" field="familyName" formData={formData} updateFormProperty={updateFormProperty}></FormInput>
      </Row>
      <Row className="mb-3">
        <FormInput name="Email" field="emailAddress" formData={formData} updateFormProperty={updateFormProperty}></FormInput>
        <FormInput name="Phone" field="phoneNumber" formData={formData} updateFormProperty={updateFormProperty}></FormInput>
        <FormInput name="Fax" field="faxNumber" formData={formData} updateFormProperty={updateFormProperty}></FormInput>
      </Row>
      <Row className="mb-3">
        <FormInput name="Courier account" field="courierAccount" formData={formData} updateFormProperty={updateFormProperty}></FormInput>
        <FormInput name="Courier company" field="defaultCourrierCompany" formData={formData} updateFormProperty={updateFormProperty}></FormInput>
      </Row>
      <Row className="mb-3">
        <FormInput name="Avg customs value" field="dewarAvgCustomsValue" formData={formData} updateFormProperty={updateFormProperty}></FormInput>
        <FormInput name="Avg transport value" field="dewarAvgTransportValue" formData={formData} updateFormProperty={updateFormProperty}></FormInput>
        <FormInput name="Billing reference" field="billingReference" formData={formData} updateFormProperty={updateFormProperty}></FormInput>
      </Row>
      <Row className="mb-3">
        <FormInput name="Lab name" field="labName" formData={formData} updateFormProperty={updateFormProperty}></FormInput>
      </Row>
      <Row className="mb-3">
        <FormInput name="Lab address" type={'textarea'} field="labAddress" formData={formData} updateFormProperty={updateFormProperty}></FormInput>
      </Row>
    </Form>
  );
}

export function FormInput({
  name,
  field,
  formData,
  updateFormProperty,
  type,
}: {
  name: string;
  field: keyof FormType;
  formData: FormType;
  // eslint-disable-next-line no-unused-vars
  updateFormProperty: (field: keyof FormType, value: string) => void;
  type?: ElementType<any>;
}) {
  return (
    <Form.Group as={Col}>
      <Form.Label>{name}</Form.Label>
      <Form.Control
        as={type}
        onChange={(event) => {
          updateFormProperty(field, event.target.value);
        }}
        placeholder={'none'}
        value={formData[field]}
      />
    </Form.Group>
  );
}
