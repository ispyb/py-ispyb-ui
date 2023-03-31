import {
  getRankedResults,
  ResultRankParam,
  ResultRankShell,
} from 'legacy/helpers/mx/results/resultparser';
import { useAutoProc } from 'legacy/hooks/ispyb';
import { DataCollectionGroup } from 'legacy/pages/mx/model';
import { Col, Container } from 'react-bootstrap';
import { ResultTable } from './resultTable';

export interface Props {
  proposalName: string;
  dataCollectionGroup: DataCollectionGroup;
  selectedPipelines: string[];
  resultRankShell: ResultRankShell;
  resultRankParam: ResultRankParam;
}

export default function ResultsDataCollectionGroupPanel({
  proposalName,
  dataCollectionGroup,
  selectedPipelines,
  resultRankShell,
  resultRankParam,
}: Props) {
  const { data } = useAutoProc({
    proposalName,
    dataCollectionId:
      dataCollectionGroup.DataCollection_dataCollectionId.toString(),
  });
  if (!data || !data.length) return null;

  const results = getRankedResults(
    data.flatMap((d) => d),
    resultRankShell,
    resultRankParam,
    selectedPipelines,
    true
  );

  return (
    <Container fluid>
      <Col>
        <ResultTable results={results} proposalName={proposalName} />
      </Col>
    </Container>
  );
}
