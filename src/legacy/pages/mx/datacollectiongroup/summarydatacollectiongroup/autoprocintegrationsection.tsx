import {
  Card,
  Col,
  OverlayTrigger,
  ProgressBar,
  Row,
  Table,
  Tooltip,
} from 'react-bootstrap';
import UnitCellSection from './unitcellsection';
import { AutoProcIntegration } from 'legacy/helpers/mx/results/resultparser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

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

export default function BestResultSection({
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
      <UnitCellSection
        cell_a={bestResult.cell_a}
        cell_b={bestResult.cell_b}
        cell_c={bestResult.cell_c}
        cell_alpha={bestResult.cell_alpha}
        cell_beta={bestResult.cell_beta}
        cell_gamma={bestResult.cell_gamma}
        spaceGroup={bestResult.spaceGroup}
      ></UnitCellSection>
    </Col>,
  ];
  return compact ? (
    <Row>{content}</Row>
  ) : (
    <Card style={{ padding: 20 }}>
      <Card.Body>
        <Col>
          <OverlayTrigger
            trigger={['focus', 'hover']}
            overlay={
              <Tooltip>
                You can adjust criteria for best result selection in the session
                menu at the top of the page.
              </Tooltip>
            }
          >
            <h5 className={'text-center m-0'}>
              Best result{' '}
              <FontAwesomeIcon
                size={'xs'}
                color="lightgray"
                icon={faQuestionCircle}
              />
            </h5>
          </OverlayTrigger>
          <div className={'text-center'} style={{ textDecoration: 'italic' }}>
            <small>
              <i>from {bestResult.program}</i>
            </small>
          </div>
          <div
            style={{
              marginTop: 10,
              marginBottom: 10,
              borderTop: '1px solid lightgray',
            }}
          />
          {content}
        </Col>
      </Card.Body>
    </Card>
  );
}
