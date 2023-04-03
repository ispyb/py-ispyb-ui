import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getSpaceGroup } from 'helpers/spacegroups';
import { AutoProcIntegration } from 'legacy/helpers/mx/results/resultparser';
import { Table, Col, Row, Badge } from 'react-bootstrap';
import { DownloadResultRow } from './download';

export function ResultTable({
  results,
  proposalName,
}: {
  results: AutoProcIntegration[];
  proposalName: string;
}) {
  return (
    <div>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th className="text-center"></th>
            <th className="text-center">
              <small>Pipeline</small>
            </th>
            <th className="text-center">
              <small>SpaceGroup</small>
            </th>
            <th className="text-center">
              <small>a,b,c (Å)</small>
            </th>
            <th className="text-center">
              <small>α,β,γ (°)</small>
            </th>
            <th className="text-center">
              <small>Shell</small>
            </th>
            <th className="text-center">
              <small>Resolution (Å)</small>
            </th>
            <th className="text-center">
              <small>Multiplicity</small>
            </th>
            <th className="text-center">
              <small>Anomalous multiplicity</small>
            </th>
            <th className="text-center">
              <small>{'<I/Sigma>'}</small>
            </th>
            <th className="text-center">
              <small>Rmeas</small>
            </th>
            <th className="text-center">
              <small>Rmerge</small>
            </th>
            <th className="text-center">
              <small>Rpim</small>
            </th>
            <th className="text-center">
              <small>cc(1/2)</small>
            </th>
            <th className="text-center">
              <small>ccAno</small>
            </th>
            <th className="text-center">
              <small>Completeness %</small>
            </th>
            <th className="text-center">
              <small>Anomalous completeness %</small>
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <ResultLine
              result={r}
              key={r.id}
              proposalName={proposalName}
            ></ResultLine>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function ResultLine({
  result,
  proposalName,
}: {
  result: AutoProcIntegration;
  proposalName: string;
}) {
  if (result.inner || result.outer || result.overall)
    return (
      <DownloadResultRow result={result} proposalName={proposalName}>
        <td className="align-middle" style={{ width: 0, padding: 10 }}>
          <FontAwesomeIcon icon={faFileDownload} />
        </td>
        <ResultCol
          values={[result.program]}
          tags={result.anomalous ? ['ANOM'] : []}
        />
        <ResultCol values={[getSpaceGroup(result.spaceGroup)?.name]} />
        <ResultCol
          values={[
            result.cell_a.toFixed(1),
            result.cell_b.toFixed(1),
            result.cell_c.toFixed(1),
          ]}
        />
        <ResultCol
          values={[
            result.cell_alpha.toFixed(1),
            result.cell_beta.toFixed(1),
            result.cell_gamma.toFixed(1),
          ]}
        />
        <ResultCol colored values={['Inner', 'Outer', 'Overall']} />
        <ResultCol
          colored
          values={[
            `${result.inner?.resolutionLimitLow?.toFixed(
              1
            )} - ${result.inner?.resolutionLimitHigh?.toFixed(1)}`,
            `${result.outer?.resolutionLimitLow?.toFixed(
              1
            )} - ${result.outer?.resolutionLimitHigh?.toFixed(1)}`,
            `${result.overall?.resolutionLimitLow?.toFixed(
              1
            )} - ${result.overall?.resolutionLimitHigh?.toFixed(1)}`,
          ]}
        />
        <ResultCol
          colored
          values={[
            result.inner?.multiplicity?.toFixed(1),
            result.outer?.multiplicity?.toFixed(1),
            result.overall?.multiplicity?.toFixed(1),
          ]}
        />
        <ResultCol
          colored
          values={[
            result.inner?.multiplicityAnomalous?.toFixed(1),
            result.outer?.multiplicityAnomalous?.toFixed(1),
            result.overall?.multiplicityAnomalous?.toFixed(1),
          ]}
        />
        <ResultCol
          colored
          thresholds={{ good: 2, bad: 1 }}
          values={[
            result.inner?.meanIOverSigI?.toFixed(1),
            result.outer?.meanIOverSigI?.toFixed(1),
            result.overall?.meanIOverSigI?.toFixed(1),
          ]}
        />
        <ResultCol
          colored
          values={[
            result.inner?.rMeas?.toFixed(1),
            result.outer?.rMeas?.toFixed(1),
            result.overall?.rMeas?.toFixed(1),
          ]}
        />
        <ResultCol
          colored
          values={[
            result.inner?.rMerge?.toFixed(1),
            result.outer?.rMerge?.toFixed(1),
            result.overall?.rMerge?.toFixed(1),
          ]}
        />
        <ResultCol
          colored
          values={[
            result.inner?.rPim?.toFixed(1),
            result.outer?.rPim?.toFixed(1),
            result.overall?.rPim?.toFixed(1),
          ]}
        />
        <ResultCol
          colored
          thresholds={{ good: 0.7, bad: 0.3 }}
          values={[
            result.inner?.ccHalf?.toFixed(1),
            result.outer?.ccHalf?.toFixed(1),
            result.overall?.ccHalf?.toFixed(1),
          ]}
        />
        <ResultCol
          colored
          values={[
            result.inner?.ccAno?.toFixed(1),
            result.outer?.ccAno?.toFixed(1),
            result.overall?.ccAno?.toFixed(1),
          ]}
        />
        <ResultCol
          colored
          values={[
            result.inner?.completeness?.toFixed(1),
            result.outer?.completeness?.toFixed(1),
            result.overall?.completeness?.toFixed(1),
          ]}
        />
        <ResultCol
          colored
          values={[
            result.inner?.completenessAnomalous?.toFixed(1),
            result.outer?.completenessAnomalous?.toFixed(1),
            result.overall?.completenessAnomalous?.toFixed(1),
          ]}
        />
      </DownloadResultRow>
    );
  else
    return (
      <tr style={{ backgroundColor: '#d3d3d345' }}>
        <ResultCol
          values={[result.program]}
          tags={result.anomalous ? ['ANOM'] : []}
        />
        <ResultCol tags={[result.status]} colSpan={15} />
      </tr>
    );
}

function ResultCol({
  values = [],
  tags = [],
  colSpan,
  colored = false,
  thresholds = undefined,
}: {
  values?: (string | number | undefined)[];
  tags?: (string | number | undefined)[];
  colSpan?: number;
  colored?: boolean;
  thresholds?: { good: number; bad: number } | undefined;
}) {
  const colors = colored
    ? ['purple', 'green', 'blue']
    : [undefined, undefined, undefined];
  return (
    <td className="align-middle" colSpan={colSpan}>
      <Col>
        {values.map((v, i) => {
          if (thresholds && v !== undefined) {
            const bg =
              v <= thresholds.bad
                ? '#ff88888c'
                : v >= thresholds.good
                ? '#94ff948c'
                : '#aeecff8c';
            return (
              <Row key={`v${i}`}>
                <small style={{ color: colors[i] }} className="text-center">
                  <div style={{ backgroundColor: bg }}>
                    {v !== undefined ? v : ''}
                  </div>
                </small>
              </Row>
            );
          }
          return (
            <Row key={`v${i}`}>
              <small style={{ color: colors[i] }} className="text-center">
                {v !== undefined ? v : ''}
              </small>
            </Row>
          );
        })}
        {tags.map((t, i) => (
          <Row key={`t${i}`}>
            <Col></Col>
            <Col xs={'auto'}>
              <Badge bg={getBg(t)}>{t}</Badge>
            </Col>
            <Col></Col>
          </Row>
        ))}
      </Col>
    </td>
  );
}

function getBg(value: string | number | undefined) {
  if (value?.toString().toUpperCase() === 'FAILED') return 'danger';
  if (value?.toString().toUpperCase() === 'RUNNING') return 'warning';
  if (value?.toString().toUpperCase() === 'NO_RESULTS') return 'warning';
  return 'info';
}
