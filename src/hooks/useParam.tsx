import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useParam<T extends string = string>(
  paramName: string
): [T | undefined, (value?: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsObj = Object.fromEntries(searchParams);

  const setParam = (value?: T) => {
    const newParams = {
      ...searchParamsObj,
    };
    if (value === undefined) {
      delete newParams[paramName];
      setSearchParams(newParams, { replace: true });
    } else {
      newParams[paramName] = value;
      setSearchParams(newParams, { replace: true });
    }
  };

  const value = searchParams.get(paramName) || undefined;
  return [value as T, setParam];
}

/**
 * Use a state variable that is persisted in the URL (state is preserved when copy/pasting or saving an URL)
 * The variable will stay in the URL as long as the component lives :
 * - when the component is mounted, the variable is declared in the URL
 * - when the component is unmounted, the variable is removed from the URL
 * - when the url is changed, the variable is written back if the component is still alive
 * @param paramName name of the parameter in the URL
 * @param defaultValue default value of the parameter
 * @returns [value, update callback]
 */
export function usePersistentParamState<T extends string = string>(
  paramName: string,
  defaultValue: T
): [T, (value?: T) => void] {
  const { declareParam, cleanParam, getValue, setValue } = React.useContext(
    PersistentParamStateContext
  );

  useEffect(() => {
    // Declare the param in the context on component mount
    declareParam(paramName);
    return () => {
      // Clean the param in the context on component unmount
      cleanParam(paramName);
    };
  }, [declareParam, cleanParam, paramName]);

  const value = useMemo(() => {
    return (getValue(paramName) || defaultValue) as T;
  }, [getValue, paramName, defaultValue]);

  const update = useCallback(
    (value?: T) => {
      setValue(paramName, value || defaultValue);
    },
    [setValue, paramName, defaultValue]
  );

  return [value, update];
}

interface PersistentParamStateContextType {
  setValue: (name: string, value: string) => void;
  getValue: (name: string) => string | undefined;
  declareParam: (name: string) => void;
  cleanParam: (name: string) => void;
}

const PersistentParamStateContext =
  React.createContext<PersistentParamStateContextType>({
    setValue: () => {},
    getValue: () => undefined,
    declareParam: () => undefined,
    cleanParam: () => undefined,
  });

export function PersistentParamStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [usedParams, setUsedParams] = useState<Record<string, number>>({});

  const [searchParams, setSearchParams] = useSearchParams();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(searchParams)
  );

  useEffect(() => {
    const searchParamsObj = Object.fromEntries(searchParams);

    let updateParams = false;

    const newValues = { ...searchParamsObj, ...values };
    const newParams = {
      ...searchParamsObj,
    };

    // Check all values to see if they are still used by a component or if they need to be updated in the url
    Object.entries(newValues).forEach(([name, value]) => {
      if (usedParams[name] === 0) {
        // if the param is not used by any component anymore, remove it from the state and the url
        updateParams = true;
        delete newValues[name];
        delete newParams[name];
      } else if (searchParamsObj[name] !== value) {
        // if the param is used by a component but the value is different from the one in the url, update the url
        updateParams = true;
        newParams[name] = value;
      }
    });
    if (JSON.stringify(newValues) !== JSON.stringify(values)) {
      setValues(newValues);
    }
    if (updateParams) {
      setSearchParams(newParams, { replace: true });
    }
  }, [values, usedParams, searchParams, setSearchParams]);

  // counts how many components are using a param
  const declareParam = useCallback(
    (name: string) => {
      setUsedParams((prev) => {
        return {
          ...prev,
          [name]: (prev[name] || 0) + 1,
        };
      });
    },
    [setUsedParams]
  );

  // counts how many components are using a param
  const cleanParam = useCallback(
    (name: string) => {
      setUsedParams((prev) => {
        const count = name in prev ? prev[name] : undefined;
        if (count !== undefined) {
          return {
            ...prev,
            [name]: count - 1,
          };
        } else {
          return prev;
        }
      });
    },
    [setUsedParams]
  );

  // updates the value of a param in the state
  const setValue = useCallback(
    (name: string, value: string) => {
      setValues((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    },
    [setValues]
  );

  // gets the value of a param from the state
  const getValue = useCallback(
    (name: string) => {
      return values[name];
    },
    [values]
  );

  return (
    <PersistentParamStateContext.Provider
      value={{
        setValue,
        getValue,
        declareParam,
        cleanParam,
      }}
    >
      {children}
    </PersistentParamStateContext.Provider>
  );
}
