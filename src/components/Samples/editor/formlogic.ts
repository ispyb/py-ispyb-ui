import produce from 'immer';
import _ from 'lodash';
import { set } from 'lodash';
import { useState } from 'react';

// Definitely not ideal -- to be replaced when we review form libraries.

export type OnChangeFormEventType = (
  property: _.PropertyPath
) => React.ChangeEventHandler;

export type OnChangeFormValueType = (
  property: _.PropertyPath
) => (value: any) => void;

export type OnChangeSubFormType = (property: _.PropertyPath) => SubFormProps;

export type OnChangeFormRemoveType = () => void;
export type OnChangeFormReplaceType = (value: any) => void;

export type SubFormProps = {
  event: OnChangeFormEventType;
  subForm: OnChangeSubFormType;
  value: OnChangeFormValueType;
  remove: OnChangeFormRemoveType;
  replace: OnChangeFormReplaceType;
};

export type ErrorListType =
  | { [k: string]: ErrorListType }
  | undefined
  | ErrorListType[]
  | string[]
  | string;

export const getSubFormErrors = (
  e: ErrorListType,
  path: string | number
): ErrorListType => {
  if (e === undefined) return undefined;
  if (typeof e === 'string') return undefined;
  return _.get(e, path, undefined);
};
export const getErrorMessage = (
  e: ErrorListType,
  path?: string | number
): string | undefined => {
  if (e === undefined) return undefined;
  if (!path && typeof e === 'string') return e;
  if (path) {
    const res = _.get(e, path, undefined);
    if (typeof res === 'string') return res;
  }
  return undefined;
};

export const hasErrors = (e: ErrorListType): boolean => {
  if (e === undefined) return false;
  if (typeof e === 'string') return true;
  if (!Array.isArray(e)) {
    for (const path in e) {
      const v = e[path];
      if (typeof v == 'string') return true;
      if (hasErrors(v)) return true;
    }
  } else {
    for (const v of e) {
      if (hasErrors(v)) return true;
    }
  }
  return false;
};

export function useFormChangeHandler<T extends Object>(
  v: T
): [T, OnChangeFormValueType, OnChangeFormEventType, OnChangeSubFormType] {
  const [vState, setVState] = useState({ ...v });

  const onChange = (property: _.PropertyPath) => {
    return (newValue: any) => {
      const next = produce(vState, (draft) => {
        const v = newValue === '' || newValue === null ? undefined : newValue;
        set(draft, property, v);
      });
      setVState(next);
    };
  };

  const onChangeFormEvent: OnChangeFormEventType = (
    property: _.PropertyPath
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(property)(e.target.value);
    };
  };

  const onChangeFormValue: OnChangeFormValueType = (
    property: _.PropertyPath
  ) => {
    return (value: any) => {
      onChange(property)(value);
    };
  };

  const onChangeSubForm: OnChangeSubFormType = (property: _.PropertyPath) => {
    function concatPropertyPath(
      a: _.PropertyPath,
      b: _.PropertyPath
    ): _.PropertyPath {
      if (Array.isArray(a)) {
        if (Array.isArray(b)) {
          return [...a, ...b];
        } else {
          return [...a, b];
        }
      } else {
        if (Array.isArray(b)) {
          return [a, ...b];
        } else {
          return [a as any, b];
        }
      }
    }
    const event: OnChangeFormEventType = (subProperty: _.PropertyPath) => {
      return onChangeFormEvent(concatPropertyPath(property, subProperty));
    };

    const value: OnChangeFormValueType = (subProperty: _.PropertyPath) => {
      return onChangeFormValue(concatPropertyPath(property, subProperty));
    };

    const remove = () => {
      onChangeFormValue(property)(undefined);
    };

    const replace = (value: any) => {
      onChangeFormValue(property)(value);
    };

    const subForm: OnChangeSubFormType = (subProperty: _.PropertyPath) => {
      return onChangeSubForm(concatPropertyPath(property, subProperty));
    };
    return { event, value, subForm, remove, replace };
  };

  return [vState, onChange, onChangeFormEvent, onChangeSubForm];
}
