import React from 'react';

import { Form, Col, Row, InputGroup } from 'react-bootstrap';

// export const ColFieldFactory = (baseProps) => {
//   return props => <ColField {...props} {...baseProps} />;
// };

export default function ColField(props: any) {
  const {
    id,
    classNames,
    label,
    help,
    required,
    description,
    errors,
    children,
  } = props;

  // root is treated differently, undocumented :/
  if (id === 'root') {
    return (
      <div>
        <legend id={id}>{description}</legend>
        {children}
      </div>
    );
  }

  let { displayLabel } = props;
  if (props.noLabel) displayLabel = false;

  const Wrap = displayLabel ? Col : React.Fragment;
  const wrapArgs = displayLabel ? { sm: 0 } : {};

  const colWidth = props.colWidth || 3;
  if (displayLabel) wrapArgs.sm = 12 - colWidth;

  return (
    <Row className={classNames}>
      {displayLabel && (
        <Form.Label column sm={colWidth} htmlFor={id} className="text-nowrap">
          {label}
          {required ? '*' : null}
        </Form.Label>
      )}
      <Wrap {...wrapArgs}>
        <InputGroup>
          {children}
          {props.schema.unit && (
            <InputGroup.Text>{props.schema.unit}</InputGroup.Text>
          )}
        </InputGroup>
        {displayLabel && description ? (
          <Form.Text className="text-muted">{description}</Form.Text>
        ) : null}
        {errors}
        {help}
      </Wrap>
    </Row>
  );
}
