import { Card, Col, Container, ProgressBar, Row, Table } from 'react-bootstrap';
import { UnitCellInfo } from './UnitCellInfo';
import { AutoProcIntegration } from 'legacy/helpers/mx/results/resultparser';
import { HelpIcon } from 'components/Common/HelpIcon';

function getColorProgressBarByCompleness(completeness: number) {
  if (completeness > 90) {
    return 'info';
  }
  if (completeness > 50) {
    return 'warning';
  }
  return 'danger';
}

function getShellStatistics(
  type: string,
  completeness: number | undefined,
  resolutionLimitLow: number | undefined,
  resolutionLimitHigh: number | undefined,
  rMerge: number | undefined,
  meanIOverSigI: number | undefined
) {
  if (completeness === undefined) {
    completeness = 0;
  }
  return (
    <tr>
      <td>
        <small>{type}</small>
      </td>
      <td>
        <ProgressBar
          variant={getColorProgressBarByCompleness(completeness)}
          now={completeness}
          label={completeness.toFixed(1) + '%'}
        />
      </td>
      <td>
        <small>{`${resolutionLimitLow?.toFixed(
          1
        )} - ${resolutionLimitHigh?.toFixed(1)}`}</small>
      </td>
      <td>
        <small>{rMerge?.toFixed(1)}</small>
      </td>
      <td>
        <small>{meanIOverSigI?.toFixed(1)}</small>
      </td>
    </tr>
  );
}

export function BestAutoprocResult({
  bestResult,
}: {
  bestResult: AutoProcIntegration;
}) {
  const content = [
    <Col key={0}>
      <Table
        size="sm"
        style={{ whiteSpace: 'nowrap', fontSize: '1rem' }}
        responsive
        className="parameterKey"
      >
        <thead>
          <tr>
            <td className="parameterValue">
              <small>{bestResult.spaceGroup}</small>
            </td>
            <td className="parameterValue">
              <small>Compl.</small>
            </td>
            <td className="parameterValue">
              <small>Res.</small>
            </td>
            <td className="parameterValue">
              <small>Rmerge</small>
            </td>
            <td className="parameterValue">
              <small>I/Sigma</small>
            </td>
          </tr>
        </thead>
        <tbody>
          {getShellStatistics(
            'Inner',
            bestResult.inner?.completeness,
            bestResult.inner?.resolutionLimitLow,
            bestResult.inner?.resolutionLimitHigh,
            bestResult.inner?.rMerge,
            bestResult.inner?.meanIOverSigI
          )}
          {getShellStatistics(
            'Outer',
            bestResult.outer?.completeness,
            bestResult.outer?.resolutionLimitLow,
            bestResult.outer?.resolutionLimitHigh,
            bestResult.outer?.rMerge,
            bestResult.outer?.meanIOverSigI
          )}
          {getShellStatistics(
            'Overall',
            bestResult.overall?.completeness,
            bestResult.overall?.resolutionLimitLow,
            bestResult.overall?.resolutionLimitHigh,
            bestResult.overall?.rMerge,
            bestResult.overall?.meanIOverSigI
          )}
        </tbody>
      </Table>
    </Col>,
    <Col key={1}>
      <UnitCellInfo
        cell_a={bestResult.cell_a}
        cell_b={bestResult.cell_b}
        cell_c={bestResult.cell_c}
        cell_alpha={bestResult.cell_alpha}
        cell_beta={bestResult.cell_beta}
        cell_gamma={bestResult.cell_gamma}
        spaceGroup={bestResult.spaceGroup}
      ></UnitCellInfo>
    </Col>,
  ];
  return (
    <Card
      style={{
        height: '100%',
      }}
    >
      <Card.Body
        style={{
          height: '100%',
          overflow: 'auto',
        }}
      >
        <Container fluid>
          <Row>
            <Col>
              <div className={'text-center m-0 mt-2'}>
                <strong>
                  Best result
                  <HelpIcon
                    message={`You can adjust criteria for best result selection in the ranking
                menu at the top of the page.`}
                  ></HelpIcon>
                </strong>
              </div>

              <div
                className={'text-center'}
                style={{ textDecoration: 'italic' }}
              >
                <small>
                  <i>from {bestResult.program}</i>
                </small>
              </div>

              <hr className="m-0 mt-2 mb-2" />
              <div className="p-1">{content}</div>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
}
