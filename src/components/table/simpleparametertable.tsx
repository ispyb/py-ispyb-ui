import React from 'react';
import { Table } from 'react-bootstrap';

interface Parameter {
  key: string;
  value: string | number | null;
  className?: string;
  units?: string;
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
                <td>{parameter.key}</td>
                <td>
                  <strong>{parameter.value} </strong> {parameter.units ? parameter.units : ''}
                </td>
              </tr>
            );
          }
        })}
      </tbody>
    </Table>
  );
}
