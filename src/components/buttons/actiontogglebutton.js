import React, { useState } from 'react';
import { ToggleButton } from 'react-bootstrap';

export default function ActionToggleButton(props) {
  const [checked = true, setChecked] = useState(true);
  const { text } = props;
  return (
    <>
      <ToggleButton
        style={{ margin: 1 }}
        size="sm"
        key={'asdada' + text}
        id={`radio-` + text}
        type="checkbox"
        variant={checked ? 'outline-primary' : 'light'}
        name="radio"
        value={checked}
        checked={checked}
        onChange={() => {
          setChecked(!checked);
        }}
      >
        {text}
      </ToggleButton>
    </>
  );
}
