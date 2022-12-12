import { createRef, Suspense, useCallback, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useSuspense } from 'rest-hooks';
import { WidgetProps, UIOptionsType, EnumOptionsType } from '@rjsf/utils';
import PaginatedResource from '../../api/resources/Base/Paginated';

interface SelectOptions<T = any, F = any> extends UIOptionsType<T, F> {
  resource: typeof PaginatedResource;
  params: Record<string, string>;
  key: string;
  value: string;
}

interface SelectWidgetProps<T = any, F = any>
  extends Omit<WidgetProps, 'options'> {
  options: NonNullable<SelectOptions<T, F>> & {
    enumOptions?: EnumOptionsType[];
  };
}

function Select(props: SelectWidgetProps) {
  const ref = createRef<HTMLSelectElement>();

  const {
    id,
    value,
    disabled,
    readonly,
    autofocus,
    onBlur,
    onFocus,
    onChange,
    options,
  } = props;

  const selectOptions = useSuspense(
    options.resource?.list(),
    options.params ? options.params : {}
  );

  const setValue = useCallback(() => {
    setTimeout(() => {
      if (ref.current) onChange(ref.current.value);
    }, 1000);
  }, [ref, onChange]);

  // useEffect(() => {
  //   console.log('mount');
  //   setValue();
  // }, [setValue]);

  useEffect(() => {
    if (value === undefined) setValue();
  }, [value, setValue, ref]);

  return (
    <Form.Control
      ref={ref}
      as="select"
      className="remote-select"
      value={value}
      id={id}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      onChange={(event) => onChange(event.target.value)}
      onBlur={id && onBlur && ((event) => onBlur(id, event.target.value))}
      onFocus={id && onFocus && ((event) => onFocus(id, event.target.value))}
    >
      {options &&
        selectOptions.results.map((c: any) => (
          <option key={c[options.value]} value={c[options.value]}>
            {c[options.key]}
          </option>
        ))}
    </Form.Control>
  );
}

function RemoteSelect(props: WidgetProps) {
  const selectProps = props as unknown as SelectWidgetProps;
  return (
    <Suspense fallback={<>Loading Options...</>}>
      <Select {...selectProps} />
    </Suspense>
  );
}

export default RemoteSelect;
