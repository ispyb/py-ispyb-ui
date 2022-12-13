import { Table } from 'react-bootstrap';

function toNumber(value: any) {
  if (value === null || value === undefined) return undefined;
  const res = Number(value);
  if (Number.isNaN(res)) return undefined;
  return res.toFixed(1);
}

export default function UnitCellSection({
  cell_a,
  cell_b,
  cell_c,
  cell_alpha,
  cell_beta,
  cell_gamma,
}: {
  cell_a: number | string | undefined;
  cell_b: number | string | undefined;
  cell_c: number | string | undefined;
  cell_alpha: number | string | undefined;
  cell_beta: number | string | undefined;
  cell_gamma: number | string | undefined;
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
            <td>
              <small>a</small>
            </td>
            <td>
              <small>b</small>
            </td>
            <td>
              <small>c</small>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <small>{toNumber(cell_a)} Å</small>
            </td>
            <td>
              <small>{toNumber(cell_b)} Å</small>
            </td>
            <td>
              <small>{toNumber(cell_c)} Å</small>
            </td>
          </tr>
        </tbody>

        <thead style={{ borderTop: 'none' }}>
          <tr>
            <td>
              <small>α</small>
            </td>
            <td>
              <small>β</small>
            </td>
            <td>
              <small>γ</small>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <small>{toNumber(cell_alpha)} °</small>
            </td>
            <td>
              <small>{toNumber(cell_beta)} °</small>
            </td>
            <td>
              <small>{toNumber(cell_gamma)} °</small>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}
