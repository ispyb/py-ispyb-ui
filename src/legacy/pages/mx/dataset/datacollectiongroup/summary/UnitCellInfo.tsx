import { getSpaceGroup } from 'helpers/spacegroups';
import { Col, Row, Table } from 'react-bootstrap';

function toNumber(value: any) {
  if (value === null || value === undefined) return undefined;
  const res = Number(value);
  if (Number.isNaN(res)) return undefined;
  return res.toFixed(1);
}

export function UnitCellInfo({
  cell_a,
  cell_b,
  cell_c,
  cell_alpha,
  cell_beta,
  cell_gamma,
  spaceGroup,
}: {
  cell_a: number | string | undefined;
  cell_b: number | string | undefined;
  cell_c: number | string | undefined;
  cell_alpha: number | string | undefined;
  cell_beta: number | string | undefined;
  cell_gamma: number | string | undefined;
  spaceGroup: string | undefined;
}) {
  const spacegroupInfo = getSpaceGroup(spaceGroup);

  let args: cellShowParams = spacegroupInfo?.crystalSystem
    ? {
        Triclinic: {},
        Monoclinic: { show_cell_alpha: false, show_cell_gamma: false },
        Orthorhombic: {
          show_cell_alpha: false,
          show_cell_beta: false,
          show_cell_gamma: false,
        },
        Tetragonal: {
          show_cell_b: false,
          show_cell_alpha: false,
          show_cell_beta: false,
          show_cell_gamma: false,
        },
        Trigonal: {
          show_cell_b: false,
          show_cell_alpha: false,
          show_cell_beta: false,
          show_cell_gamma: false,
        },
        Hexagonal: {
          show_cell_b: false,
          show_cell_alpha: false,
          show_cell_beta: false,
          show_cell_gamma: false,
        },
        Cubic: {
          show_cell_b: false,
          show_cell_c: false,
          show_cell_alpha: false,
          show_cell_beta: false,
          show_cell_gamma: false,
        },
      }[spacegroupInfo.crystalSystem]
    : {};

  //special case trigonal starts by R
  if (
    spacegroupInfo?.crystalSystem === 'Trigonal' &&
    spacegroupInfo.name.startsWith('R')
  ) {
    args = {
      show_cell_b: false,
      show_cell_c: false,
      show_cell_beta: false,
      show_cell_gamma: false,
    };
  }

  const table = (
    <UnitCellTable
      cell_a={cell_a}
      cell_b={cell_b}
      cell_c={cell_c}
      cell_alpha={cell_alpha}
      cell_beta={cell_beta}
      cell_gamma={cell_gamma}
      {...args}
    />
  );

  return (
    <Col>
      <Row className={'text-center'}>
        {spacegroupInfo?.crystalSystem ? (
          <strong>
            {spacegroupInfo?.crystalSystem} system ({spacegroupInfo.name})
          </strong>
        ) : null}
      </Row>
      <Row>{table}</Row>
    </Col>
  );
}

type cellShowParams = {
  show_cell_a?: boolean;
  show_cell_b?: boolean;
  show_cell_c?: boolean;
  show_cell_alpha?: boolean;
  show_cell_beta?: boolean;
  show_cell_gamma?: boolean;
};

function UnitCellTable({
  cell_a,
  cell_b,
  cell_c,
  cell_alpha,
  cell_beta,
  cell_gamma,
  show_cell_a = true,
  show_cell_b = true,
  show_cell_c = true,
  show_cell_alpha = true,
  show_cell_beta = true,
  show_cell_gamma = true,
}: {
  cell_a: number | string | undefined;
  cell_b: number | string | undefined;
  cell_c: number | string | undefined;
  cell_alpha: number | string | undefined;
  cell_beta: number | string | undefined;
  cell_gamma: number | string | undefined;
} & cellShowParams) {
  return (
    <>
      <Table
        responsive
        size="sm"
        style={{ whiteSpace: 'nowrap', textAlign: 'center', margin: 0 }}
        striped
      >
        <thead style={{}}>
          <tr>
            {show_cell_a && (
              <td>
                <strong>
                  a{!show_cell_b && '=b'}
                  {!show_cell_c && '=c'}
                </strong>
              </td>
            )}
            {show_cell_b && (
              <td>
                <strong>b</strong>
              </td>
            )}
            {show_cell_c && (
              <td>
                <strong>c</strong>
              </td>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            {show_cell_a && (
              <td>
                <small>{toNumber(cell_a) || cell_a} Å</small>
              </td>
            )}
            {show_cell_b && (
              <td>
                <small>{toNumber(cell_b) || cell_b} Å</small>
              </td>
            )}
            {show_cell_c && (
              <td>
                <small>{toNumber(cell_c) || cell_c} Å</small>
              </td>
            )}
          </tr>
        </tbody>
      </Table>
      <Table
        responsive
        size="sm"
        style={{ whiteSpace: 'nowrap', textAlign: 'center', margin: 0 }}
        striped
      >
        <thead style={{ borderTop: 'none' }}>
          <tr>
            {show_cell_alpha && (
              <td>
                <strong>
                  α{!show_cell_beta && '=β'}
                  {!show_cell_gamma && '=γ'}
                </strong>
              </td>
            )}
            {show_cell_beta && (
              <td>
                <strong>β</strong>
              </td>
            )}
            {show_cell_gamma && (
              <td>
                <strong>γ</strong>
              </td>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            {show_cell_alpha && (
              <td>
                <small>{toNumber(cell_alpha) || cell_alpha} °</small>
              </td>
            )}
            {show_cell_beta && (
              <td>
                <small>{toNumber(cell_beta) || cell_beta} °</small>
              </td>
            )}
            {show_cell_gamma && (
              <td>
                <small>{toNumber(cell_gamma) || cell_gamma} °</small>
              </td>
            )}
          </tr>
        </tbody>
      </Table>
    </>
  );
}
