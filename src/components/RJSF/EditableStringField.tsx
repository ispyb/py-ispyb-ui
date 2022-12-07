import { KeyboardEvent } from 'react';
import {
  Registry,
  WidgetProps,
  FieldProps,
  Widget,
  getUiOptions,
  getWidget,
  hasWidget,
  optionsList,
} from '@rjsf/utils';
import { useEffect, useRef, useState } from 'react';
import { Button, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';

interface StaticFieldProps {
  name: string;
  value: string | null | undefined;
  isEditable: boolean;
  onClick: () => void;
  title?: string;
}

function StaticField(props: StaticFieldProps) {
  const { name, title, value, isEditable, onClick } = props;

  if (!isEditable) {
    return (
      <div className="value">
        <span>{value}</span>
      </div>
    );
  }

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id={name}>Click to edit</Tooltip>}
    >
      <Button
        variant="light"
        className="form-control editable text-start border"
        onClick={onClick}
        aria-label={`edit-${title || name}`}
      >
        {value !== null && value !== undefined ? (
          value
        ) : (
          <span className="click">Click to edit</span>
        )}
      </Button>
    </OverlayTrigger>
  );
}

interface EditableFieldProps {
  widget: string | Widget;
  widgetProps: WidgetProps;
  onSave: () => Promise<void>;
  onCancel: () => void;
  setEditing: (editing: boolean) => void;
}

function EditableField(props: EditableFieldProps) {
  const { widget, widgetProps, onSave, onCancel, setEditing } = props;
  const { widgets } = widgetProps.registry as Registry;
  const Widget = getWidget(widgetProps.schema, widget, widgets);
  const { onChange, disabled, ...otherProps } = widgetProps;

  const unmounted = useRef(false);
  const [edited, setEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    unmounted.current = false;
    return () => {
      unmounted.current = true;
    };
  }, []);

  const handleSave = () => {
    setSaving(true);
    onSave()
      .then(() => {
        if (unmounted.current) return;
        setEditing(false);
      })
      .catch((error_: unknown) => {
        if (unmounted.current) return;
        setError(`${error_}`);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const hasErrors = !!widgetProps.rawErrors?.length;

  return (
    <>
      <Widget
        disabled={disabled || saving}
        onChange={(v: string) => {
          if (onChange) {
            onChange(v);
          }
          setEdited(true);
        }}
        className={`form-control ${edited ? 'form-control-edited' : ''}`}
        autofocus
        onKeyDown={(evt: KeyboardEvent<HTMLElement>) => {
          if (evt.key === 'Enter' && !hasErrors) {
            handleSave();
          }
        }}
        {...otherProps}
      />
      {error && (
        <InputGroup.Text>
          <span className="editable-error text-danger">{error}</span>
        </InputGroup.Text>
      )}
      <Button
        variant="success"
        size="sm"
        onClick={handleSave}
        disabled={saving || hasErrors}
      >
        <i
          className={`fa ${saving ? 'fa-spin fa-spinner mr-1' : 'fa-check'}`}
        />
        <span className="sr-only">{saving ? 'Saving' : 'Save'}</span>
      </Button>
      <Button variant="danger" size="sm" onClick={onCancel} disabled={saving}>
        <i className="fa fa-times" />
        <span className="sr-only">Cancel</span>
      </Button>
    </>
  );
}

function StringField(props: FieldProps) {
  const {
    schema,
    name,
    uiSchema,
    idSchema,
    formData,
    required,
    disabled,
    readonly,
    onChange,
    onBlur,
    onFocus,
    registry,
    rawErrors = [],
  } = props;

  const prevValue = useRef<string>();
  const [editing, setEditing] = useState(false);

  const { title, format } = schema;
  const { widgets, formContext, schemaUtils } = registry as Registry;
  const enumOptions = schemaUtils.isSelect(schema)
    ? optionsList(schema)
    : undefined;
  let defaultWidget = enumOptions ? 'select' : 'text';
  if (format && hasWidget(schema, format, widgets)) {
    defaultWidget = format;
  }
  const {
    widget = defaultWidget,
    placeholder = '',
    ...options
  } = getUiOptions(uiSchema);

  const onClick = () => {
    prevValue.current = formData;
    setEditing(true);
  };

  const onSave = () => {
    return formContext.onSave({
      field: idSchema && idSchema.$id.replace('root_', '').replaceAll('_', '.'),
      value: formData,
    }) as Promise<void>;
  };

  const cancelEditing = () => {
    setEditing(false);
    if (prevValue.current) {
      onChange(prevValue.current);
    }
  };

  return (
    <>
      {editing ? (
        <EditableField
          widgetProps={{
            options: { ...options, enumOptions },
            schema,
            id: idSchema && idSchema.$id,
            label: title === undefined ? name : title,
            value: formData,
            onChange,
            onBlur,
            onFocus,
            required,
            disabled,
            readonly,
            formContext,
            registry,
            placeholder,
            rawErrors,
          }}
          widget={widget}
          onSave={onSave}
          setEditing={setEditing}
          onCancel={cancelEditing}
        />
      ) : (
        <>
          <StaticField
            name={name}
            title={title}
            value={
              (idSchema && formContext.staticValues[idSchema.$id]) || formData
            }
            isEditable={
              idSchema &&
              (formContext.editable as string[]).includes(idSchema.$id)
            }
            onClick={onClick}
          />
          {idSchema && formContext.extraComponents[idSchema.$id] && (
            <>{formContext.extraComponents[idSchema.$id]}</>
          )}
        </>
      )}
    </>
  );
}

export default StringField;
