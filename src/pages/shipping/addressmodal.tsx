import LoadingPanel from 'components/loading/loadingpanel';
import { ElementType, Suspense, useState } from 'react';
import { Button, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import { LabContact } from './model';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

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

const schema = Yup.object().shape({
  cardName: Yup.string().required('Mandatory field').max(40, 'Too long'),

  givenName: Yup.string().max(45, 'Too long'),
  familyName: Yup.string().max(100, 'Too long'),

  emailAddress: Yup.string().email('Valid email required').max(60, 'Too long'),
  phoneNumber: Yup.string().max(45, 'Too long'),
  faxNumber: Yup.string().max(45, 'Too long'),

  courierAccount: Yup.string().max(45, 'Too long'),
  defaultCourrierCompany: Yup.string().max(45, 'Too long'),

  dewarAvgCustomsValue: Yup.number().integer().min(0, 'Should be >=0').required('Mandatory field').typeError('A number is required'),
  dewarAvgTransportValue: Yup.number().integer().min(0, 'Should be >=0').required('Mandatory field').typeError('A number is required'),
  billingReference: Yup.string().max(45, 'Too long'),

  labName: Yup.string().max(45, 'Too long'),
  labAddress: Yup.string().max(45, 'Too long'),
});

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
    <Formik
      initialValues={formData}
      validationSchema={schema}
      onSubmit={function (values, formikHelpers) {
        return;
      }}
    >
      {(formicProps) => (
        <Form noValidate onSubmit={formicProps.handleSubmit}>
          <Row className="mb-3">
            <FormInput name="Address name" field="cardName" formicProps={formicProps}></FormInput>
          </Row>
          <Row className="mb-3">
            <FormInput name="First name" field="givenName" formicProps={formicProps}></FormInput>
            <FormInput name="Surname" field="familyName" formicProps={formicProps}></FormInput>
          </Row>
          <Row className="mb-3">
            <FormInput name="Email" field="emailAddress" formicProps={formicProps}></FormInput>
            <FormInput name="Phone" field="phoneNumber" formicProps={formicProps}></FormInput>
            <FormInput name="Fax" field="faxNumber" formicProps={formicProps}></FormInput>
          </Row>
          <Row className="mb-3">
            <FormInput name="Courier account" field="courierAccount" formicProps={formicProps}></FormInput>
            <FormInput name="Courier company" field="defaultCourrierCompany" formicProps={formicProps}></FormInput>
          </Row>
          <Row className="mb-3">
            <FormInput name="Avg customs value" field="dewarAvgCustomsValue" formicProps={formicProps}></FormInput>
            <FormInput name="Avg transport value" field="dewarAvgTransportValue" formicProps={formicProps}></FormInput>
            <FormInput name="Billing reference" field="billingReference" formicProps={formicProps}></FormInput>
          </Row>
          <Row className="mb-3">
            <FormInput name="Lab name" field="labName" formicProps={formicProps}></FormInput>
          </Row>
          <Row className="mb-3">
            <FormInput name="Lab address" type={'textarea'} field="labAddress" formicProps={formicProps}></FormInput>
          </Row>
          <Button type="submit">Save</Button>
        </Form>
      )}
    </Formik>
  );
}

export function FormInput({ name, field, type, formicProps }: { name: string; field: keyof FormType; type?: ElementType; formicProps: FormikProps<FormType> }) {
  return (
    <Form.Group as={Col}>
      <Form.Label>{name}</Form.Label>
      <InputGroup hasValidation>
        <Form.Control
          type="text"
          as={type}
          placeholder={'none'}
          onChange={formicProps.handleChange}
          name={field}
          value={formicProps.values[field]}
          isInvalid={!!formicProps.errors[field]}
        />
        <Form.Control.Feedback type="invalid">{formicProps.errors[field]}</Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
}
