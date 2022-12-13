import { Col, ProgressBar, Row, Table } from 'react-bootstrap';
import UnitCellSection from './unitcellsection';
import { AutoProcIntegration } from 'legacy/helpers/mx/resultparser';

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
  rMerge: number | undefined
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
    </tr>
  );
}

export default function AutoprocIntegrationSection({
  bestResult,
  compact,
}: {
  bestResult: AutoProcIntegration;
  compact: boolean;
}) {
  const content = [
    <Col key={0}>
      <Table
        size="sm"
        style={{ whiteSpace: 'nowrap' }}
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
          </tr>
        </thead>
        <tbody>
          {getShellStatistics(
            'Overall',
            bestResult.overall?.completeness,
            bestResult.overall?.resolutionLimitLow,
            bestResult.overall?.resolutionLimitHigh,
            bestResult.overall?.rMerge
          )}
          {getShellStatistics(
            'Inner',
            bestResult.inner?.completeness,
            bestResult.inner?.resolutionLimitLow,
            bestResult.inner?.resolutionLimitHigh,
            bestResult.inner?.rMerge
          )}
          {getShellStatistics(
            'Outer',
            bestResult.outer?.completeness,
            bestResult.outer?.resolutionLimitLow,
            bestResult.outer?.resolutionLimitHigh,
            bestResult.outer?.rMerge
          )}
        </tbody>
      </Table>
    </Col>,
    <Col key={1}>
      <UnitCellSection
        cell_a={bestResult.cell_a}
        cell_b={bestResult.cell_b}
        cell_c={bestResult.cell_c}
        cell_alpha={bestResult.cell_alpha}
        cell_beta={bestResult.cell_beta}
        cell_gamma={bestResult.cell_gamma}
      ></UnitCellSection>
    </Col>,
  ];
  return compact ? <Row>{content}</Row> : <Col>{content}</Col>;
}
