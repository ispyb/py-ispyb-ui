import { Modal } from 'react-bootstrap';
import { Crystal } from 'legacy/pages/model';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import validator from '@rjsf/validator-ajv6';
import Form from '@rjsf/bootstrap-4';
import rjsf from '@rjsf/utils';
import {
  spaceGroupLongNames,
  spaceGroupShortNames,
} from 'legacy/constants/spacegroups';
import _ from 'lodash';
import './crystaleditmodal.scss';
import LayoutField from 'react-jsonschema-form-layout-2';

export function EditCrystalModal({
  crystal,
  show,
  setShow,
  onModifiedCrystal,
}: {
  crystal: Crystal;
  show: boolean;
  // eslint-disable-next-line no-unused-vars
  setShow: (_: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onModifiedCrystal: (crystal: Crystal) => void;
}) {
  const [formKey, setFormKey] = useState(uuidv4());

  useEffect(() => {
    setFormKey(uuidv4());
  }, [crystal, show]);

  const schema: rjsf.RJSFSchema = {
    type: 'object',
    properties: {
      spaceGroup: {
        type: 'string',
        title: 'Space Group',
        enum: _(spaceGroupShortNames)
          .concat(spaceGroupLongNames)
          .uniq()
          .value(),
      },
      cellA: { type: 'number', title: 'A' },
      cellAlpha: { type: 'number', title: 'Alpha' },
      cellB: { type: 'number', title: 'B' },
      cellBeta: { type: 'number', title: 'Beta' },
      cellC: { type: 'number', title: 'C' },
      cellGamma: { type: 'number', title: 'Gamma' },
      comments: { type: 'string', title: 'Comments' },
    },
  };
  const uiSchema: rjsf.UiSchema = {
    comments: {
      'ui:widget': 'textarea',
    },
    'ui:field': 'layout',
    'ui:layout': [
      { spaceGroup: { md: 12 } },
      { cellA: { md: 6 }, cellAlpha: { md: 6 } },
      { cellB: { md: 6 }, cellBeta: { md: 6 } },
      { cellC: { md: 6 }, cellGamma: { md: 6 } },
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
          <Modal.Title>{'Edit crystal'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fields={fields}
            uiSchema={uiSchema}
            schema={schema}
            formData={crystal}
            validator={validator}
            onSubmit={(data) => {
              onModifiedCrystal(data.formData);
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
