import React from 'react';
import { Table } from 'react-bootstrap';

interface Parameter {
  key: string;
  value: string | number | null;
}

interface Props {
  parameters: Parameter[];
}

export default function SimpleParameterTable({ parameters }: Props): JSX.Element {
  return (
    <Table>
      <tbody>
        {parameters.map((parameter) => {
          {
            return (
              <tr>
                <td>{parameter.key}</td>
                <td>
                  <strong>{parameter.value}</strong>
                </td>
              </tr>
            );
          }
        })}
      </tbody>
    </Table>
  );
}
