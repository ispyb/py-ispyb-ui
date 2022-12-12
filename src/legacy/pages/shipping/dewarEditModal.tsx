import { Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import validator from '@rjsf/validator-ajv6';
import Form from '@rjsf/bootstrap-4';
import rjsf from '@rjsf/utils';
import LayoutField from 'react-jsonschema-form-layout-2';
import { SaveShippingDewar } from './model';

export function EditDewarModal({
  dewar,
  show,
  setShow,
  onModifiedDewar,
}: {
  dewar: SaveShippingDewar;
  show: boolean;
  // eslint-disable-next-line no-unused-vars
  setShow: (_: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onModifiedDewar: (dewar: SaveShippingDewar) => void;
}) {
  const [formKey, setFormKey] = useState(uuidv4());

  useEffect(() => {
    setFormKey(uuidv4());
  }, [dewar, show]);

  const schema: rjsf.RJSFSchema = {
    type: 'object',
    properties: {
      code: { type: 'string', title: 'Name' },
      storageLocation: {
        type: 'string',
        title: 'Storage Condition',
        enum: ['N/A', '-80', '-20', '+4', 'Room Temperature'],
      },
      transportValue: { type: 'number', title: 'Transport Value' },
      comments: { type: 'string', title: 'Comments' },
    },
    required: ['code'],
  };
  const uiSchema: rjsf.UiSchema = {
    comments: {
      'ui:widget': 'textarea',
    },
    'ui:field': 'layout',
    'ui:layout': [
      { code: { md: 12 } },
      { storageLocation: { md: 12 } },
      { transportValue: { md: 12 } },
      { comments: { md: 12 } },
    ],
  };

  const fields = {
    layout: LayoutField,
  };

  return (
    <div key={formKey}>
      <Modal
        centered
        backdrop="static"
        keyboard={false}
        show={show}
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{'Edit parcel'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fields={fields}
            uiSchema={uiSchema}
            schema={schema}
            formData={dewar}
            validator={validator}
            onSubmit={(data) => {
              onModifiedDewar(data.formData);
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
