import React from 'react';
import { Table } from 'react-bootstrap';

interface Parameter {
  key: string;
  value: string | number | JSX.Element | undefined | null;
  className?: string;
  units?: string;
  valueTooltip?: string;
}

interface Props {
  parameters: Parameter[];
  header?: string;
}

export default function SimpleParameterTable({ parameters, header }: Props): JSX.Element {
  return (
    <Table>
      {header && (
        <thead className={'text-primary'}>
          <tr>
            <th>{header}</th>
          </tr>
        </thead>
      )}
      <tbody>
        {parameters.map((parameter) => {
          {
            return (
              <tr className={parameter.className}>
                <td style={{ fontSize: 'smaller' }}>{parameter.key}</td>
                <td style={{ fontSize: 'x-small' }}>
                  {parameter.valueTooltip && (
                    <>
                      <strong
                        className="text-info"
                        onClick={() => {
                          alert(parameter.valueTooltip);
                        }}
                      >
                        {parameter.value}{' '}
                      </strong>
                      {parameter.units ? parameter.units : ''}
                    </>
                  )}
                  {!parameter.valueTooltip && (
                    <>
                      <strong>{parameter.value} </strong> {parameter.units ? parameter.units : ''}
                    </>
                  )}
                </td>
              </tr>
            );
          }
        })}
      </tbody>
    </Table>
  );
}
