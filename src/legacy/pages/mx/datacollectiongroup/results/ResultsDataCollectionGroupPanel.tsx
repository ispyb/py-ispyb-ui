// import {
//   getRankedResults,
//   AutoProcIntegration,
// } from 'legacy/helpers/mx/resultparser2';
import {
  AutoProcIntegration,
  getRankedResults,
  parseResults,
} from 'legacy/helpers/mx/resultparser2';
import { useAutoProc } from 'legacy/hooks/ispyb';
import {
  AutoProcInformation,
  DataCollectionGroup,
} from 'legacy/pages/mx/model';
import { Col, Row } from 'react-bootstrap';

export interface Props {
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
}

export default function ResultsDataCollectionGroupPanel({
  proposalName,
  dataCollectionGroup,
}: Props) {
  const { data } = useAutoProc({
    proposalName,
    dataCollectionId:
      dataCollectionGroup.DataCollection_dataCollectionId.toString(),
  });
  if (!data || !data.length) return null;

  const results = getRankedResults(data.flatMap((d) => d));

  //   const rankedResults = getRankedResults(dataCollectionGroup);
  return (
    <Col>
      {results.map((r) => (
        <ResultLine result={r} key={r.id}></ResultLine>
      ))}
    </Col>
  );
}

function ResultLine({ result }: { result: AutoProcIntegration }) {
  return (
    <Row>
      <Col>{result.program}</Col>
      <Col>{result.spaceGroup}</Col>
      {result.inner || result.outer || result.overall ? (
        <>
          <Col>
            <Row>{result.cell_a.toFixed(1)}</Row>
            <Row>{result.cell_b.toFixed(1)}</Row>
            <Row>{result.cell_c.toFixed(1)}</Row>
          </Col>
          <Col>
            <Row>{result.cell_alpha.toFixed(1)}</Row>
            <Row>{result.cell_beta.toFixed(1)}</Row>
            <Row>{result.cell_gamma.toFixed(1)}</Row>
          </Col>
          <Col>
            <Row>Overall</Row>
            <Row>Inner</Row>
            <Row>Outer</Row>
          </Col>
          <Col>
            <Row>
              {result.overall?.resolutionLimitLow.toFixed(1)} -{' '}
              {result.overall?.resolutionLimitHigh.toFixed(1)}
            </Row>
            <Row>
              {result.inner?.resolutionLimitLow.toFixed(1)} -{' '}
              {result.inner?.resolutionLimitHigh.toFixed(1)}
            </Row>
            <Row>
              {result.outer?.resolutionLimitLow.toFixed(1)} -{' '}
              {result.outer?.resolutionLimitHigh.toFixed(1)}
            </Row>
          </Col>
          <Col>
            <Row>{result.overall?.multiplicity.toFixed(1)}</Row>
            <Row>{result.inner?.multiplicity.toFixed(1)}</Row>
            <Row>{result.outer?.multiplicity.toFixed(1)}</Row>
          </Col>
          <Col>
            <Row>{result.overall?.completeness.toFixed(1)}</Row>
            <Row>{result.inner?.completeness.toFixed(1)}</Row>
            <Row>{result.outer?.completeness.toFixed(1)}</Row>
          </Col>
          <Col>
            <Row>{result.overall?.multiplicityAnomalous.toFixed(1)}</Row>
            <Row>{result.inner?.multiplicityAnomalous.toFixed(1)}</Row>
            <Row>{result.outer?.multiplicityAnomalous.toFixed(1)}</Row>
          </Col>
          <Col>
            <Row>{result.overall?.completenessAnomalous.toFixed(1)}</Row>
            <Row>{result.inner?.completenessAnomalous.toFixed(1)}</Row>
            <Row>{result.outer?.completenessAnomalous.toFixed(1)}</Row>
          </Col>
          <Col>
            <Row>{result.overall?.meanIOverSigI.toFixed(1)}</Row>
            <Row>{result.inner?.meanIOverSigI.toFixed(1)}</Row>
            <Row>{result.outer?.meanIOverSigI.toFixed(1)}</Row>
          </Col>
          <Col>
            <Row>{result.overall?.rMeas.toFixed(1)}</Row>
            <Row>{result.inner?.rMeas.toFixed(1)}</Row>
            <Row>{result.outer?.rMeas.toFixed(1)}</Row>
          </Col>
          <Col>
            <Row>{result.overall?.rMerge.toFixed(1)}</Row>
            <Row>{result.inner?.rMerge.toFixed(1)}</Row>
            <Row>{result.outer?.rMerge.toFixed(1)}</Row>
          </Col>
          <Col>
            <Row>{result.overall?.rPim.toFixed(1)}</Row>
            <Row>{result.inner?.rPim.toFixed(1)}</Row>
            <Row>{result.outer?.rPim.toFixed(1)}</Row>
          </Col>
          <Col>
            <Row>{result.overall?.ccHalf.toFixed(1)}</Row>
            <Row>{result.inner?.ccHalf.toFixed(1)}</Row>
            <Row>{result.outer?.ccHalf.toFixed(1)}</Row>
          </Col>
          <Col>
            <Row>{result.overall?.ccAno.toFixed(1)}</Row>
            <Row>{result.inner?.ccAno.toFixed(1)}</Row>
            <Row>{result.outer?.ccAno.toFixed(1)}</Row>
          </Col>
        </>
      ) : (
        <Col>{result.status}</Col>
      )}
    </Row>
  );
}
