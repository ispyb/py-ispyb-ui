import { Shells } from 'legacy/helpers/mx/resultparser';
import React from 'react';
import { Col, ProgressBar, Row, Table } from 'react-bootstrap';
import UnitCellSection from './unitcellsection';

function getColorProgressBarByCompleness(completeness: string) {
  if (parseFloat(completeness) > 90) {
    return 'info';
  }
  if (parseFloat(completeness) > 50) {
    return 'warning';
  }
  return 'danger';
}

function getShellStatistics(
  type: string,
  completeness: string | undefined,
  resolutionLimitLow: string | undefined,
  resolutionLimitHigh: string | undefined,
  rMerge: string | undefined
) {
  if (completeness === undefined) {
    completeness = '0';
  }
  return (
    <tr>
      <td>{type}</td>
      <td>
        <ProgressBar
          variant={getColorProgressBarByCompleness(completeness)}
          now={parseFloat(completeness)}
          label={completeness + '%'}
        />{' '}
      </td>
      <td>{`${resolutionLimitLow} - ${resolutionLimitHigh}`}</td>
      <td>{rMerge}</td>
    </tr>
  );
}

export default function AutoprocIntegrationSection({
  bestResult,
  compact,
}: {
  bestResult: Shells;
  compact: boolean;
}) {
  const content = [
    <Col>
      <Table
        size="sm"
        style={{ whiteSpace: 'nowrap' }}
        responsive
        className="parameterKey"
      >
        <thead>
          <tr>
            <td className="parameterValue">{bestResult.refShell.spaceGroup}</td>
            <td className="parameterValue">Completeness</td>
            <td className="parameterValue">Res.</td>
            <td className="parameterValue">Rmerge</td>
          </tr>
        </thead>
        <tbody>
          {getShellStatistics(
            'Overall',
            bestResult.shells.overall.completeness,
            bestResult.shells.overall.resolutionLimitLow,
            bestResult.shells.overall.resolutionLimitHigh,
            bestResult.shells.overall.rMerge
          )}
          {getShellStatistics(
            'Inner',
            bestResult.shells.innerShell.completeness,
            bestResult.shells.innerShell.resolutionLimitLow,
            bestResult.shells.innerShell.resolutionLimitHigh,
            bestResult.shells.innerShell.rMerge
          )}
          {getShellStatistics(
            'Outer',
            bestResult.shells.outerShell.completeness,
            bestResult.shells.outerShell.resolutionLimitLow,
            bestResult.shells.outerShell.resolutionLimitHigh,
            bestResult.shells.outerShell.rMerge
          )}
        </tbody>
      </Table>
    </Col>,
    <Col>
      <UnitCellSection
        cell_a={bestResult.shells.innerShell.cell_a}
        cell_b={bestResult.shells.innerShell.cell_b}
        cell_c={bestResult.shells.innerShell.cell_c}
        cell_alpha={bestResult.shells.innerShell.cell_alpha}
        cell_beta={bestResult.shells.innerShell.cell_beta}
        cell_gamma={bestResult.shells.innerShell.cell_gamma}
      ></UnitCellSection>
    </Col>,
  ];
  return compact ? <Row>{content}</Row> : <Col>{content}</Col>;
}
