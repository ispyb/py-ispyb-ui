import { FormProps } from '@rjsf/core';
import validator from '@rjsf/validator-ajv6';
import BS4Form from '@rjsf/bootstrap-4';

import ColField from './ColField';
import RemoteSelect from './RemoteSelect';
import { Button } from 'react-bootstrap';

interface IFormProps extends Omit<FormProps, 'validator'> {
  button?: boolean;
  submitText?: string;
  children?: JSX.Element;
}

export default function Form(props: IFormProps) {
  const widgets = {
    remoteSelect: RemoteSelect,
  };
  return (
    <BS4Form
      validator={validator}
      templates={{ FieldTemplate: ColField }}
      widgets={widgets}
      {...props}
    >
      {props.children && <>{props.children}</>}
      {props.button ? (
        <Button type="submit">{props.submitText || 'Submit'}</Button>
      ) : (
        <></>
      )}
    </BS4Form>
  );
}
