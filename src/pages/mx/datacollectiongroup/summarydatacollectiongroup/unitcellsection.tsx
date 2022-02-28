import React from 'react';
import { Table } from 'react-bootstrap';

export default function UnitCellSection({
  cell_a,
  cell_b,
  cell_c,
  cell_alpha,
  cell_beta,
  cell_gamma,
}: {
  cell_a: string | undefined;
  cell_b: string | undefined;
  cell_c: string | undefined;
  cell_alpha: string | undefined;
  cell_beta: string | undefined;
  cell_gamma: string | undefined;
}) {
  return (
    <Table responsive style={{ fontSize: '9px', textAlign: 'center' }}>
      <tbody>
        <tr>
          <td>a</td>
          <td>b</td>
          <td>c</td>
        </tr>
        <tr>
          <td>
            <b>{cell_a} Å</b>
          </td>
          <td>
            <b>{cell_b} Å</b>
          </td>
          <td>
            <b>{cell_c} Å</b>
          </td>
        </tr>
        <tr>
          <td>α</td>
          <td>β</td>
          <td>γ</td>
        </tr>
        <tr>
          <td>
            <b>{cell_alpha} °</b>
          </td>
          <td>
            <b>{cell_beta} °</b>
          </td>
          <td>
            <b>{cell_gamma} °</b>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
