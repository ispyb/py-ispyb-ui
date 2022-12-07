import Form from 'components/RJSF/Form';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

import EditableStringField from './EditableStringField';

interface InlineEditableProps<T, F> {
  schema: RJSFSchema;
  uiSchema: UiSchema<T, F>;
  editable: string[];
  formData: T;

  onChange: ({ field, value }: { field: string; value: any }) => void;
  staticValues: Record<string, any>;
  extraComponents: Record<string, any>;
  className: string;
}

function InlineEditable<T = any, F = any>(props: InlineEditableProps<T, F>) {
  const onSave = ({ field, value }: { field: string; value: string }) => {
    return props.onChange({ field, value });
  };

  // Convert null to undefined so rjsf doesnt validate empty fields
  const undefedFormData: Record<string, any> = {};
  Object.entries(props.formData as Record<string, any>).map(([key, fd]) => {
    return (undefedFormData[key] = fd === null ? undefined : fd);
  });

  return (
    <Form
      className={`editable-form ${props.className}`}
      fields={{ StringField: EditableStringField }}
      schema={props.schema}
      formData={undefedFormData}
      uiSchema={props.uiSchema}
      liveValidate
      omitExtraData
      // showErrorList={false}
      button={false}
      formContext={{
        editable: props.editable,
        staticValues: props.staticValues,
        extraComponents: props.extraComponents,
        onSave,
      }}
    />
  );
}

InlineEditable.defaultProps = {
  uiSchema: {},
  editable: [],
  colWidth: 5,
  staticValues: {},
  extraComponents: {},
  className: '',
};

export default InlineEditable;
