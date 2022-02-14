import React from 'react';
import { Shell } from 'helpers/mx/resultparser';
import { Table } from 'react-bootstrap';

export default function UnitCellSection({ innerShell }: { innerShell: Shell }) {
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
            <b>{innerShell.cell_a} Å</b>
          </td>
          <td>
            <b>{innerShell.cell_b} Å</b>
          </td>
          <td>
            <b>{innerShell.cell_c} Å</b>
          </td>
        </tr>
        <tr>
          <td>α</td>
          <td>β</td>
          <td>γ</td>
        </tr>
        <tr>
          <td>
            <b>{innerShell.cell_alpha} °</b>
          </td>
          <td>
            <b>{innerShell.cell_beta} °</b>
          </td>
          <td>
            <b>{innerShell.cell_gamma} °</b>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
