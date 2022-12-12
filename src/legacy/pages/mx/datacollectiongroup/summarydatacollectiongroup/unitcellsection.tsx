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
    <>
      <Table
        responsive
        size="sm"
        style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
      >
        <thead>
          <tr>
            <td>a</td>
            <td>b</td>
            <td>c</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{cell_a} Å</td>
            <td>{cell_b} Å</td>
            <td>{cell_c} Å</td>
          </tr>
        </tbody>

        <thead style={{ borderTop: 'none' }}>
          <tr>
            <td>α</td>
            <td>β</td>
            <td>γ</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{cell_alpha} °</td>
            <td>{cell_beta} °</td>
            <td>{cell_gamma} °</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}
