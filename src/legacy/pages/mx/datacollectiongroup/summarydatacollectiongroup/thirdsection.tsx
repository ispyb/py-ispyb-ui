import { DataCollectionGroup } from 'legacy/pages/mx/model';
import ScreeningSection from './screeningsection';
import BestResultSection from './autoprocintegrationsection';
import {
  getBestResult,
  ResultRankParam,
  ResultRankShell,
} from 'legacy/helpers/mx/results/resultparser';
import { useAutoProc } from 'legacy/hooks/ispyb';
import { Alert, Container } from 'react-bootstrap';

export default function ThirdSection({
  proposalName,
  dataCollectionGroup,
  compact,
  selectedPipelines,
  resultRankShell,
  resultRankParam,
}: {
  proposalName: string;

  dataCollectionGroup: DataCollectionGroup;
  compact: boolean;
  selectedPipelines: string[];
  resultRankShell: ResultRankShell;
  resultRankParam: ResultRankParam;
}) {
  const { data } = useAutoProc({
    proposalName,
    dataCollectionId:
      dataCollectionGroup.DataCollection_dataCollectionId.toString(),
  });
  if (!data || !data.length) return null;

  const bestResultWithPipelineFilter = getBestResult(
    data.flatMap((d) => d),
    resultRankShell,
    resultRankParam,
    selectedPipelines
  );

  const bestResultNoPipelineFilter = getBestResult(
    data.flatMap((d) => d),
    resultRankShell,
    resultRankParam,
    []
  );

  if (bestResultWithPipelineFilter) {
    return (
      <Container fluid>
        <BestResultSection
          compact={compact}
          bestResult={bestResultWithPipelineFilter}
        ></BestResultSection>
      </Container>
    );
  }
  if (bestResultNoPipelineFilter) {
    return (
      <Container fluid>
        <Alert variant="light">
          A result is available with pipeline{' '}
          <strong>
            <i>{bestResultNoPipelineFilter.program}</i>
          </strong>{' '}
          which is filtered out.
        </Alert>
      </Container>
    );
  }
  return (
    <Container fluid>
      <ScreeningSection
        compact={compact}
        dataCollectionGroup={dataCollectionGroup}
      ></ScreeningSection>
    </Container>
  );
}
